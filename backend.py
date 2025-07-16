import yt_dlp
import requests
import re
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
import os
from flask import send_from_directory
import urllib.parse
# --- Setup ---
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) to allow your frontend
# to communicate with this backend.
CORS(app)

# --- Utility Functions ---

def format_duration(seconds):
    """Formats seconds into a HH:MM:SS or MM:SS string."""
    if seconds is None:
        return "N/A"
    try:
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        if h > 0:
            return f"{h:02d}:{m:02d}:{s:02d}"
        else:
            return f"{m:02d}:{s:02d}"
    except (ValueError, TypeError):
        return "N/A"

def sanitize_filename(filename):
    """Removes illegal characters from a string so it can be a valid filename."""
    return re.sub(r'[\\/*?:"<>|]', "", filename)

def process_formats(formats_list):
    """Processes the raw formats list from yt-dlp into the structure the frontend expects."""
    processed = []
    if not formats_list:
        return processed
        
    for f in formats_list:
        vcodec = f.get('vcodec', 'none')
        acodec = f.get('acodec', 'none')

        if vcodec == 'none' and acodec == 'none':
            continue

        format_type = 'video' if vcodec != 'none' else 'audio'
        
        resolution = f.get('resolution')
        if not resolution and f.get('height'):
             resolution = f"{f.get('width')}x{f.get('height')}"
        elif not resolution:
            resolution = 'audio' if format_type == 'audio' else 'N/A'

        # حساب الحجم
        filesize = f.get('filesize') or f.get('filesize_approx')
        if not filesize:
            # حاول التقدير إذا توفر tbr وduration
            tbr = f.get('tbr')  # كيلوبيت/ثانية
            duration = f.get('duration')
            if tbr and duration:
                try:
                    filesize = int((float(tbr) * float(duration)) / 8) * 1024  # بالبايت
                except Exception:
                    filesize = None

        processed.append({
            'format_id': f.get('format_id'),
            'resolution': resolution,
            'ext': f.get('ext'),
            'vcodec': vcodec,
            'acodec': acodec,
            'filesize': filesize,
            'type': format_type,
            'note': f.get('format_note', ''),
        })
    return processed

def extract_video_details(entry):
    """Extracts a common video details structure from a yt-dlp info dictionary."""
    if not entry:
        return None
    return {
        "id": entry.get("id"),
        "title": entry.get("title"),
        "thumbnailUrl": entry.get("thumbnail"),
        "duration": format_duration(entry.get("duration")),
        "formats": process_formats(entry.get("formats", []))
    }

# --- API Endpoints ---

@app.route('/api/info', methods=['GET'])
def get_video_or_playlist_info():
    """
    Fetches metadata for a video or a playlist.
    Returns a JSON object with `type: 'video'` or `type: 'playlist'`.
    """
    url = request.args.get('url')
    if not url:
        return jsonify({"message": "URL parameter is missing."}), 400

    # NOTE: For large playlists, this can be slow as it fetches formats for all videos.
    # A more advanced implementation might fetch basic info first, then formats on demand.
    ydl_opts = {'quiet': True, 'extract_flat': False} 
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            if info.get('_type') == 'playlist':
                # It's a playlist
                playlist_videos = [extract_video_details(entry) for entry in info.get('entries', []) if entry]
                
                response_data = {
                    "type": "playlist",
                    "id": info.get("id"),
                    "title": info.get("title", "Untitled Playlist"),
                    "videos": playlist_videos
                }
            else:
                # It's a single video
                response_data = extract_video_details(info)
                if response_data:
                    response_data["type"] = "video"

            if not response_data:
                 return jsonify({"message": "Could not extract video or playlist data."}), 500

            return jsonify(response_data)

    except yt_dlp.utils.DownloadError as e:
        app.logger.error(f"yt-dlp download error: {e}")
        return jsonify({"message": "Failed to fetch info. The URL might be invalid, private, or geo-restricted."}), 404
    except Exception as e:
        app.logger.error(f"An unexpected error occurred: {e}")
        return jsonify({"message": "An unexpected server error occurred."}), 500


@app.route('/api/download', methods=['GET'])
def download_video():
    """
    Downloads a specific format of a video.
    This endpoint remains unchanged as it works for any video ID.
    """
    video_id = request.args.get('videoId')
    format_id = request.args.get('formatId')

    if not video_id or not format_id:
        return jsonify({"message": "videoId and formatId parameters are required."}), 400

    video_url = f"https://www.youtube.com/watch?v={video_id}"

    try:
        ydl_opts = {'format': format_id, 'quiet': True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            download_url = info.get('url')
            
            title = sanitize_filename(info.get('title', 'video'))
            ext = info.get('ext', 'mp4')
            # جلب الجودة أو الملاحظة أو الدقة
            quality = info.get('format_note') or info.get('resolution') or ''
            if quality:
                quality = sanitize_filename(str(quality))
                filename = f"{title} - {quality}.{ext}"
            else:
                filename = f"{title}.{ext}"

            # جلب الحجم
            filesize = info.get('filesize') or info.get('filesize_approx')
            if not filesize:
                tbr = info.get('tbr')
                duration = info.get('duration')
                if tbr and duration:
                    try:
                        filesize = int((float(tbr) * float(duration)) / 8) * 1024
                    except Exception:
                        filesize = None
        req = requests.get(download_url, stream=True)
        headers = {
            'Content-Type': req.headers['Content-Type'],
            'Content-Disposition': f'attachment; filename="{filename}"'
        }
        if filesize:
            headers['Content-Length'] = str(filesize)
        return Response(stream_with_context(req.iter_content(chunk_size=1024*1024)), headers=headers)

    except Exception as e:
        app.logger.error(f"Failed to process download: {e}")
        return jsonify({"message": f"Failed to process download for format {format_id}."}), 500

@app.route('/download/<path:filename>', methods=['GET'])
def download_pretty_url(filename):
    """
    Endpoint لتحميل الفيديو برابط يبدو طبيعي (بدون API أو باراميترات)،
    يستخرج videoId وformatId من الكويري (أو من اسم الملف إذا أردت لاحقاً).
    مثال: /download/اسم-الفيديو-الجودة.mp4?videoId=xxx&formatId=yyy
    """
    video_id = request.args.get('videoId')
    format_id = request.args.get('formatId')
    if not video_id or not format_id:
        return jsonify({"message": "videoId and formatId parameters are required."}), 400

    video_url = f"https://www.youtube.com/watch?v={video_id}"
    try:
        ydl_opts = {'format': format_id, 'quiet': True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            download_url = info.get('url')
            # اسم الملف من الرابط وليس من info (لضمان التطابق)
            safe_filename = sanitize_filename(filename)
            filesize = info.get('filesize') or info.get('filesize_approx')
            if not filesize:
                tbr = info.get('tbr')
                duration = info.get('duration')
                if tbr and duration:
                    try:
                        filesize = int((float(tbr) * float(duration)) / 8) * 1024
                    except Exception:
                        filesize = None
        req = requests.get(download_url, stream=True)
        headers = {
            'Content-Type': req.headers['Content-Type'],
            'Content-Disposition': f'attachment; filename="{safe_filename}"'
        }
        if filesize:
            headers['Content-Length'] = str(filesize)
        return Response(stream_with_context(req.iter_content(chunk_size=1024*1024)), headers=headers)
    except Exception as e:
        app.logger.error(f"Failed to process pretty download: {e}")
        return jsonify({"message": f"Failed to process download for {filename}."}), 500

# --- Main Execution ---
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join('dist', path)):
        return send_from_directory('dist', path)
    else:
        return send_from_directory('dist', 'index.html')
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)