import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ChevronDown, ChevronUp, HelpCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const Faq: React.FC = () => {
    const { isDarkMode } = useStore();

    const faqSections = [
        {
            title: "Platforms, Licenses & Purchase",
            items: [
                {
                    q: "Where can I buy a license?",
                    a: (
                        <span>
                            This website is a portfolio and catalog showcase only. For secure license purchase, we rely on <a href="https://pinegroove.gumroad.com" target="_blank" rel="noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline font-medium">Gumroad</a>, which offers a robust and reliable e-commerce structure. Licenses are also available through our wide network of distributors, including famous microstock agencies like <a href="https://audiojungle.net/user/pantheonmusic/portfolio" target="_blank" rel="noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline">Envato</a>, <a href="https://www.pond5.com/it/artist/pinegroove" target="_blank" rel="noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline">Pond5</a>, <a href="https://luckstock.com/users/portfolio/Pantheon/?ref=Pantheon" target="_blank" rel="noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline">Luckstock</a>, and many others, but Gumroad generally offers the most competitive pricing.
                        </span>
                    )
                },
                {
                    q: "What is a Stock Music License?",
                    a: "A Stock Music (or Royalty-Free) license allows you to pay a one-time fee to use the music in your projects without having to pay additional royalties or fees based on the number of views, duration of use, or territory. Once you buy the license, you can use the track forever for that specific project scope."
                },
                {
                    q: "What kind of synchronization licenses are available?",
                    a: "We offer four synchronization license types on Gumroad: Standard, Broadcast, Video Game, and Theatrical. The Standard license is the most affordable and covers the majority of typical online and low-budget uses. The other licenses are for specific, high-budget applications."
                },
                {
                    q: "Do I get an official invoice?",
                    a: "Yes, Gumroad handles all the transactions and provides an official receipt/invoice that serves as proof of purchase and valid license documentation."
                }
            ]
        },
        {
            title: "Usage, Rights & Restrictions",
            items: [
                {
                    q: "Can I edit the music tracks?",
                    a: "Absolutely. You can loop, cut, fade, and process the audio to fit your project's needs."
                },
                {
                    q: "What are the limits of the Synchronization License?",
                    a: (
                        <div>
                            <p className="mb-2">A Synchronization License grants the right to use the music in media but not ownership or the right to create a new derivative musical work for sale. This means it is <strong>not allowed</strong> to:</p>
                            <ul className="list-disc pl-5 space-y-1 opacity-90">
                                <li>Re-sing or modify the lyrics over an instrumental version of my songs.</li>
                                <li>Remix the music to create a new song for commercial sale.</li>
                                <li>Use the content to train Artificial Intelligence (AI).</li>
                            </ul>
                            <p className="mt-2">These actions require a separate Sampling License, which must be discussed and negotiated outside of the standard agreements.</p>
                        </div>
                    )
                }
            ]
        },
        {
            title: "Professional & TV Licensing",
            items: [
                {
                    q: "Do I need to purchase a license if I am a TV professional?",
                    a: "If you are a professional working in the TV industry (such as a TV producer, music supervisor, or editor), you do not need to purchase a license upfront. Since I earn performance royalties directly through my P.R.O. (BMI), you can contact me for a blanket license arrangement. I will send you the necessary music files and all data required for cue sheet compilation."
                }
            ]
        },
        {
            title: "Commissioned Work",
            items: [
                {
                    q: "Are you available for custom music work?",
                    a: (
                        <div>
                            <p className="mb-2">Yes, I am available for commissioned work. Please contact me directly for a project quote at <a href="mailto:info@pinegroove.net" className="text-sky-600 dark:text-sky-400 hover:underline">info@pinegroove.net</a>. I offer flexibility, including:</p>
                            <ul className="list-disc pl-5 space-y-1 opacity-90">
                                <li><strong>Non-Exclusive Tailored Tracks:</strong> Where I create custom music for your project but retain all rights, allowing me to resell the music later (more budget-friendly).</li>
                                <li><strong>Exclusive Contracts:</strong> Available for higher-budget projects requiring full, exclusive rights transfer.</li>
                            </ul>
                        </div>
                    )
                }
            ]
        },
        {
            title: "Claims & YouTube",
            items: [
                {
                    q: "Can I use the music for YouTube monetization?",
                    a: (
                        <span>
                            Yes! All our tracks are suitable for YouTube monetization. However, if the track is registered with Content ID, you might receive an automated copyright claim. Don't worry, this is not a strike. Simply use our <Link to="/content-id" className="text-sky-600 dark:text-sky-400 hover:underline">Content ID Removal form</Link> or clear the claim using your license certificate purchased on Gumroad.
                        </span>
                    )
                },
                {
                    q: "What happens if I get a copyright claim?",
                    a: (
                        <span>
                            A copyright claim on YouTube is an automated notice. It is <strong>NOT</strong> a strike against your channel. Since you have purchased a license, you have the right to use the music. You can remove the claim by forwarding your license details via our <Link to="/content-id" className="text-sky-600 dark:text-sky-400 hover:underline">Content ID page</Link>.
                        </span>
                    )
                }
            ]
        }
    ];

    return (
        <div className="pb-32">
            <SEO title="Frequently Asked Questions" description="Find answers to common questions about music licensing, usage rights, and purchasing options on Pinegroove." />

            {/* Hero Header */}
            <div className="relative h-[50vh] min-h-[400px] flex items-start pt-24 justify-center overflow-hidden">
                {/* Background Image - Licensing/Documents theme */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop" 
                        alt="Licensing Documents" 
                        className="w-full h-full object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 ${isDarkMode ? 'to-zinc-950' : 'to-white'}`}></div>
                </div>

                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                    <HelpCircle size={64} className="mx-auto text-sky-400 mb-6 drop-shadow-lg" />
                    <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight drop-shadow-2xl">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl opacity-90 font-medium tracking-wide drop-shadow-md">
                        Everything you need to know about licensing, usage, and rights.
                    </p>
                </div>
            </div>

            {/* Main Content with Overlap */}
            <div className="max-w-4xl mx-auto px-4 relative z-20 -mt-6 md:-mt-20">
                <div className={`rounded-3xl p-8 md:p-12 shadow-2xl ${isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-100'}`}>
                    <div className="space-y-12">
                        {faqSections.map((section, sectionIdx) => (
                            <div key={sectionIdx}>
                                {/* Section Title - Primary Color */}
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-zinc-800 text-sky-500">
                                    {section.title}
                                </h2>
                                <div className="space-y-4">
                                    {section.items.map((item, idx) => (
                                        <AccordionItem key={idx} question={item.q} answer={item.a} isDark={isDarkMode} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-16 pt-8 border-t border-gray-200 dark:border-zinc-800 opacity-60">
                        <p>Still have questions?</p>
                        <a href="mailto:info@pinegroove.net" className="text-sky-600 dark:text-sky-400 hover:underline font-bold mt-2 inline-block">Contact us directly</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AccordionItem: React.FC<{ question: string; answer: React.ReactNode; isDark: boolean }> = ({ question, answer, isDark }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${isDark ? 'bg-zinc-950/50 border-zinc-800' : 'bg-gray-50 border-zinc-200'} ${isOpen ? 'ring-1 ring-sky-500/30' : ''}`}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
                <span className="pr-4">{question}</span>
                {isOpen ? <ChevronUp className="text-sky-500 shrink-0" /> : <ChevronDown className="opacity-50 shrink-0" />}
            </button>
            
            <div 
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-5 pt-0 text-sm md:text-base leading-relaxed opacity-80 border-t border-dashed border-gray-200 dark:border-zinc-800 mt-2 pt-4 mx-5 mb-2">
                    {answer}
                </div>
            </div>
        </div>
    );
};