import React from 'react';
import { useStore } from '../store/useStore';

export const Faq: React.FC = () => {
    const { isDarkMode } = useStore();
    
    const faqs = [
        { q: "What is a synchronization license?", a: "A synchronization license allows you to use a piece of music in your video or multimedia project. It gives you the legal right to sync the audio with your visual content." },
        { q: "Can I monetize my YouTube videos?", a: "Yes! Once you purchase a license, you can clear copyright claims and monetize your content. Use our Content ID form to whitelist your video." },
        { q: "Is the payment secure?", a: "Yes, all transactions are processed through Gumroad, a trusted and secure e-commerce platform for creators." },
        { q: "Do I own the music?", a: "No, you are purchasing a license to use the music. The copyright remains with Pinegroove/Francesco Biondi." },
        { q: "What format are the files?", a: "When you purchase a license, you typically receive high-quality WAV (44.1kHz/16-bit or 24-bit) and MP3 files." }
    ];

    return (
        <div className="max-w-3xl mx-auto px-4 py-16 pb-32">
            <h1 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h1>
            <div className="space-y-6">
                {faqs.map((item, idx) => (
                    <div key={idx} className={`p-6 rounded-xl border transition hover:shadow-md ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                        <h3 className="font-bold text-lg mb-3 text-sky-600 dark:text-sky-400">{item.q}</h3>
                        <p className="opacity-80 leading-relaxed">{item.a}</p>
                    </div>
                ))}
            </div>
            <div className="text-center mt-12 opacity-60 text-sm">
                More questions? <a href="mailto:info@pinegroove.net" className="underline">Contact us</a>
            </div>
        </div>
    );
};
