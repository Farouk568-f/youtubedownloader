import React, { useState } from 'react';

interface HeroSectionProps {
  onFetch: (url: string) => void;
  isLoading: boolean;
  error: string | null;
}

const DownloadArrowIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const HeroSection: React.FC<HeroSectionProps> = ({ onFetch, isLoading, error }) => {
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

  const handleFetch = (e: React.FormEvent) => {
    e.preventDefault();
    onFetch(url);
  };

  return (
    <section id="hero" className="relative section pt-48 pb-32 overflow-hidden">
      <div className="grid-bg"></div>
      <div className="aurora-bg"></div>

      <div className="container relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center" data-aos="fade-up" data-aos-delay="100">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-slate-50 to-slate-400 text-transparent bg-clip-text" style={{ fontFamily: 'var(--heading-font)' }}>
                YouTube Video <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">Downloader</span>
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
                Paste the link to your favorite YouTube video or playlist below to generate download links for multiple formats and qualities. Fast, free, and easy to use.
            </p>
            <form onSubmit={handleFetch} className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube Video or Playlist URL..."
                  className="w-full h-16 pl-6 pr-48 text-lg bg-slate-800/50 border-2 border-slate-700 rounded-full focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 focus:outline-none transition-all duration-300 placeholder-slate-500 text-slate-200 backdrop-blur-sm"
                  aria-label="YouTube video or playlist URL"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute top-1/2 -translate-y-1/2 right-2 w-44 h-12 flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <DownloadArrowIcon className="w-6 h-6" />
                      <span>Fetch Video</span>
                    </>
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-4 text-red-400 text-center font-semibold">{error}</p>
              )}
            </form>
          </div>
      </div>
    </section>
  );
};

export default HeroSection;