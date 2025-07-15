export interface DownloadFormat {
  format_id: string;
  resolution: string; // e.g., "1920x1080" or "audio only"
  ext: string; // e.g., 'mp4', 'webm'
  vcodec?: string; // e.g., 'avc1.640028', 'vp9'
  acodec?: string; // e.g., 'mp4a.40.2', 'opus'
  filesize: number | null; // Size in bytes
  type: 'video' | 'audio';
  note?: string; // e.g., '4K', 'HD'
}

// Base details for a single video
export interface VideoDetails {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  formats: DownloadFormat[];
}

// API response for a single video
export interface VideoInfo extends VideoDetails {
  type: 'video';
}

// API response for a playlist
export interface PlaylistInfo {
  id: string;
  title: string;
  videos: VideoDetails[];
  type: 'playlist';
}

// Union type for the API response
export type APIResponse = VideoInfo | PlaylistInfo;