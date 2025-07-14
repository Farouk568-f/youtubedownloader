import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '../constants.tsx';

const FAQ_DATA = [
    {
        question: "Is this YouTube downloader service free to use?",
        answer: "Yes, our tool is completely free for personal use. You can download as many videos as you like without any hidden charges or subscriptions."
    },
    {
        question: "What video qualities and formats are supported?",
        answer: "We support a wide range of formats including MP4, WebM, and MP3 for audio. You can download videos in qualities ranging from 144p up to 1080p and even 4K if the original video supports it."
    },
    {
        question: "Is it legal to download YouTube videos?",
        answer: "Downloading videos from YouTube may be against their terms of service. You should only download videos for which you have permission from the copyright owner, or videos that are in the public domain or have a Creative Commons license."
    },
    {
        question: "Does this service work on mobile devices?",
        answer: "Absolutely! Our website is fully responsive and works on any device with a modern web browser, including iPhones, Android phones, and tablets. No app installation is required."
    }
];

interface FaqItemProps {
    faq: { question: string; answer: string };
    isOpen: boolean;
    onClick: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ faq, isOpen, onClick }) => {
    return (
        <div className="border-b border-slate-800" data-aos="fade-up">
            <button
                className="w-full flex justify-between items-center text-left py-6 px-2"
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <h3 className="text-xl font-semibold text-slate-100">{faq.question}</h3>
                <ChevronDownIcon className={`w-6 h-6 text-cyan-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: 'auto', y: 0 },
                            collapsed: { opacity: 0, height: 0, y: -10 }
                        }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 px-2 text-slate-400 text-lg leading-relaxed">
                            <p>{faq.answer}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FaqSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="section bg-slate-950">
            <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="section-title" data-aos="fade-up">
                    <h2>Frequently Asked Questions</h2>
                    <p className="text-lg">Have questions? We've got answers. Find everything you need to know here.</p>
                </div>
                <div className="mt-8">
                    {FAQ_DATA.map((faq, index) => (
                        <FaqItem
                            key={index}
                            faq={faq}
                            isOpen={openIndex === index}
                            onClick={() => handleToggle(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;