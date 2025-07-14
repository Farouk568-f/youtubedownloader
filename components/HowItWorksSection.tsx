import React from 'react';
import { LinkIcon, ListChecksIcon, DownloadIcon } from '../constants.tsx';

interface StepCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    stepNumber: number;
    delay: number;
}

const StepCard: React.FC<StepCardProps> = ({ icon, title, description, stepNumber, delay }) => {
    return (
        <div 
            className="relative flex flex-col items-center text-center"
            data-aos="fade-up"
            data-aos-delay={delay}
        >
            <div className="w-28 h-28 flex items-center justify-center rounded-full bg-slate-800 border-2 border-slate-700 mb-6 relative z-10 transition-all duration-300 group-hover:border-cyan-400">
                <span className="absolute -top-3 -right-3 w-12 h-12 flex items-center justify-center bg-cyan-400 text-slate-900 font-bold rounded-full text-xl border-4 border-slate-950">
                    {stepNumber}
                </span>
                <div className="text-cyan-400">{icon}</div>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-3" style={{ fontFamily: 'var(--heading-font)' }}>{title}</h3>
            <p className="text-slate-400 max-w-xs text-lg">{description}</p>
        </div>
    );
};

const HowItWorksSection: React.FC = () => {
    return (
        <section id="how-it-works" className="section bg-slate-900">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="section-title" data-aos="fade-up">
                    <h2>How It Works</h2>
                    <p className="text-lg">Get your favorite videos in three simple steps.</p>
                </div>

                <div className="relative grid md:grid-cols-3 gap-16 md:gap-8 mt-8">
                    <div className="absolute top-14 left-0 right-0 h-1 border-t-2 border-dashed border-slate-700 hidden md:block"></div>
                    
                    <StepCard 
                        icon={<LinkIcon className="w-14 h-14"/>}
                        title="1. Paste Link"
                        description="Find your video on YouTube, copy its URL, and paste it into the input field on our homepage."
                        stepNumber={1}
                        delay={100}
                    />
                    <StepCard 
                        icon={<ListChecksIcon className="w-14 h-14"/>}
                        title="2. Choose Format"
                        description="We'll fetch the available download options. Select your preferred quality and format (MP4, MP3, etc.) from the list."
                        stepNumber={2}
                        delay={200}
                    />
                    <StepCard 
                        icon={<DownloadIcon className="w-14 h-14"/>}
                        title="3. Download"
                        description="Click the download button next to your chosen format. The video will start downloading to your device instantly."
                        stepNumber={3}
                        delay={300}
                    />
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;