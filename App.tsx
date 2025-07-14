import React, { useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import AOS from 'aos';
import Header from './components/Header.tsx';
import HeroSection from './components/HeroSection.tsx';
import DownloadSection from './components/ResultsSection.tsx';
import HowItWorksSection from './components/HowItWorksSection.tsx';
import FaqSection from './components/FaqSection.tsx';
import Footer from './components/Footer.tsx';
import { fetchVideoInfo } from './services/geminiService.ts';
import { APIResponse } from './types.ts';

const App: React.FC = () => {
  const [results, setResults] = useState<APIResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 400, damping: 90 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  
  const gradient = useMotionTemplate`
    radial-gradient(250px circle at ${smoothMouseX}px ${smoothMouseY}px, rgba(255, 255, 255, 0.1), transparent 50%)
  `;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);

    AOS.init({
      duration: 800,
      easing: 'ease-in-out-quad',
      once: true,
      mirror: false
    });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleFetch = useCallback(async (url: string) => {
    if (!url.trim()) {
      setError("Please enter a YouTube URL.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const result = await fetchVideoInfo(url);
      setResults(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while fetching video info.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="bg-slate-950 text-slate-300">
      <motion.div
        className="pointer-events-none fixed inset-0 z-30"
        style={{ background: gradient }}
      />
      <Header />
      <main>
        <HeroSection onFetch={handleFetch} isLoading={isLoading} error={error} />
        <DownloadSection
          results={results}
          isLoading={isLoading}
        />
        <HowItWorksSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;