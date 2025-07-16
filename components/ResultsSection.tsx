import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APIResponse, VideoDetails, DownloadFormat } from '../types.ts';
import { DownloadIcon } from '../constants.tsx';

interface ResultsSectionProps {
  results: APIResponse | null;
  isLoading: boolean;
}

const API_BASE_URL = "http://localhost:5000";

const SkeletonLoader: React.FC = () => (
    <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl animate-pulse">
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
                <div className="w-full aspect-video bg-slate-800 rounded-lg"></div>
            </div>
            <div className="md:col-span-2 space-y-4">
                <div className="h-8 bg-slate-800 rounded w-3/4"></div>
                <div className="h-6 bg-slate-800 rounded w-1/2"></div>
            </div>
        </div>
        <div className="mt-6 border-t border-slate-800 pt-4">
            <div className="h-6 bg-slate-800 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-slate-800 rounded-lg"></div>
                ))}
            </div>
        </div>
    </div>
);

const formatBytes = (bytes: number | null, decimals = 2) => {
    if (bytes === null) return 'N/A';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const CodecBadge: React.FC<{ codec?: string }> = ({ codec }) => {
    if (!codec || codec === 'none') return null;
    const codecName = codec.split('.')[0];
    return <span className="text-xs font-mono bg-slate-700 text-slate-300 px-2 py-1 rounded">{codecName}</span>;
}

const getUniqueSortedFormats = (formats: DownloadFormat[], type: 'video' | 'audio') => {
    // فلترة الجودات غير المفيدة
    let filtered = formats.filter(f => f.filesize && f.filesize > 0);
    // ترتيب من الأعلى للأقل (حسب الدقة أو الجودة أو الحجم)
    if (type === 'video') {
        // ترتيب حسب الدقة (resolution) ثم الحجم
        filtered = filtered.sort((a, b) => {
            // استخراج الرقم من الدقة (مثلاً 1080 من 1920x1080)
            const getRes = (f: DownloadFormat) => {
                const match = f.resolution.match(/(\d+)[pP]/) || f.resolution.match(/(\d+)x(\d+)/);
                if (match) return parseInt(match[1]);
                return 0;
            };
            const resB = getRes(b);
            const resA = getRes(a);
            if (resB !== resA) return resB - resA;
            return (b.filesize || 0) - (a.filesize || 0);
        });
        // إظهار أفضل جودة لكل دقة/امتداد فقط
        const unique: {[key: string]: DownloadFormat} = {};
        filtered.forEach(f => {
            const key = `${f.resolution}_${f.ext}`;
            if (!unique[key]) unique[key] = f;
        });
        return Object.values(unique);
    } else {
        // للصوتيات: ترتيب حسب الحجم ثم الجودة
        filtered = filtered.sort((a, b) => (b.filesize || 0) - (a.filesize || 0));
        // إظهار أفضل جودة لكل امتداد فقط
        const unique: {[key: string]: DownloadFormat} = {};
        filtered.forEach(f => {
            const key = `${f.ext}`;
            if (!unique[key]) unique[key] = f;
        });
        return Object.values(unique);
    }
};

const FormatTable: React.FC<{ formats: DownloadFormat[], type: 'video' | 'audio', videoId: string }> = ({ formats, type, videoId }) => {
    // تنظيم الجودات
    const organizedFormats = getUniqueSortedFormats(formats, type);
    if (organizedFormats.length === 0) return null;
    return (
        <div>
            <h4 className="text-xl font-bold text-slate-200 mb-4">{type === 'video' ? 'Video Formats' : 'Audio Formats'}</h4>
            <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                    <thead className="text-sm text-slate-400 border-b-2 border-slate-700">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">{type === 'video' ? 'Resolution' : 'Quality'}</th>
                            <th className="p-3">Ext</th>
                            <th className="p-3 hidden sm:table-cell">Codec</th>
                            <th className="p-3">Size</th>
                            <th className="p-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {organizedFormats.map((format) => (
                            <tr key={format.format_id} className="hover:bg-slate-800/50 transition-colors duration-200">
                                <td className="p-3 font-mono text-slate-400">{format.format_id}</td>
                                <td className="p-3 font-semibold text-slate-100">{format.note || format.resolution}</td>
                                <td className="p-3 uppercase font-semibold text-cyan-400">{format.ext}</td>
                                <td className="p-3 hidden sm:table-cell">
                                    <div className="flex items-center gap-2">
                                        <CodecBadge codec={format.vcodec} />
                                        <CodecBadge codec={format.acodec} />
                                    </div>
                                </td>
                                <td className="p-3">{formatBytes(format.filesize)}</td>
                                <td className="p-3 text-right">
                                    <button
                                        onClick={() => handleDownload(videoId, format.format_id, format.ext)}
                                        className="flex items-center justify-center space-x-2 rtl:space-x-reverse bg-cyan-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:bg-cyan-500 hover:scale-105 text-sm">
                                        <DownloadIcon className="w-5 h-5"/>
                                        <span className="hidden md:inline">Download</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const VideoDownloaderCard: React.FC<{ video: VideoDetails }> = ({ video }) => {
    const videoFormats = video.formats.filter(f => f.type === 'video').sort((a,b) => (b.filesize || 0) - (a.filesize || 0));
    const audioFormats = video.formats.filter(f => f.type === 'audio').sort((a,b) => (b.filesize || 0) - (a.filesize || 0));
  
    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-black/20">
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
                <div className="md:col-span-1">
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full rounded-lg aspect-video object-cover" />
                </div>
                <div className="md:col-span-2">
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-100 line-clamp-2" style={{ fontFamily: 'var(--heading-font)' }}>{video.title}</h3>
                    <p className="text-slate-400 mt-2 text-lg">Duration: {video.duration}</p>
                </div>
            </div>
            <div className="mt-8 border-t border-slate-700/50 pt-6 space-y-8">
                <FormatTable videoId={video.id} formats={videoFormats} type="video" />
                <FormatTable videoId={video.id} formats={audioFormats} type="audio" />
            </div>
        </div>
    );
};

const [isDownloading, setIsDownloading] = React.useState(false);

const handleDownload = async (videoId: string, formatId: string, filename: string) => {
  try {
    setIsDownloading(true);
    const downloadUrl = `/download/${encodeURIComponent(filename)}?videoId=${videoId}&formatId=${formatId}`;
    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error('Download failed');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert('حدث خطأ أثناء التحميل');
  } finally {
    setIsDownloading(false);
  }
};

const DownloadSection: React.FC<ResultsSectionProps> = ({ results, isLoading }) => {
    if (isLoading) {
        return (
            <section id="download-results" className="section pt-0">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SkeletonLoader />
                </div>
            </section>
        );
    }

    return (
        <AnimatePresence>
            {results && (
                <motion.section
                    id="download-results"
                    className="section pt-0"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto space-y-12">
                            {results.type === 'playlist' && (
                                <>
                                    <div className="text-center">
                                        <h2 className="text-3xl md:text-4xl font-bold text-slate-100" style={{ fontFamily: 'var(--heading-font)' }}>
                                            Playlist: {results.title}
                                        </h2>
                                        <p className="text-lg text-slate-400 mt-2">{results.videos.length} videos found</p>
                                    </div>
                                    {results.videos.map((video) => (
                                        <VideoDownloaderCard key={video.id} video={video} />
                                    ))}
                                </>
                            )}
                            {results.type === 'video' && (
                                <VideoDownloaderCard video={results} />
                            )}
                        </div>
                    </div>
                </motion.section>
            )}
            {isDownloading && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl flex flex-col items-center">
                  <svg className="animate-spin h-10 w-10 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  <p className="text-lg text-cyan-200 font-bold">جاري التحميل...</p>
                </div>
              </div>
            )}
        </AnimatePresence>
    );
};

export default DownloadSection;