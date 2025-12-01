import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ShieldCheck, Youtube } from 'lucide-react';

export const ContentId: React.FC = () => {
  const { isDarkMode } = useStore();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Since no backend is configured, we simulate submission or redirect to mailto
      setSubmitted(true);
      setTimeout(() => {
        window.location.href = "mailto:info@pinegroove.net?subject=Content ID Removal Request&body=Please see the details in my attached form...";
      }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 pb-32">
      <div className="text-center mb-10">
        <ShieldCheck size={64} className="mx-auto text-sky-500 mb-4" />
        <h1 className="text-3xl font-bold mb-4">YouTube Content ID Removal</h1>
        <p className="opacity-70">Received a copyright claim? Don't panic. If you have purchased a license, simply fill out this form to clear your video.</p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className={`p-8 rounded-2xl shadow-lg border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold mb-2">Video URL</label>
                    <div className="relative">
                        <Youtube className="absolute left-3 top-3 opacity-50" size={20}/>
                        <input required type="url" placeholder="https://www.youtube.com/watch?v=..." className="w-full p-3 pl-10 rounded border bg-transparent outline-none focus:border-sky-500" />
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-bold mb-2">License Key / Receipt</label>
                    <input required type="text" placeholder="Found in your Gumroad email" className="w-full p-3 rounded border bg-transparent outline-none focus:border-sky-500" />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">Your Email</label>
                    <input required type="email" placeholder="email@example.com" className="w-full p-3 rounded border bg-transparent outline-none focus:border-sky-500" />
                </div>

                <div className="pt-4">
                    <button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 rounded-lg transition shadow-lg">
                        Submit Removal Request
                    </button>
                </div>
                <p className="text-xs text-center opacity-50">Clicking submit will open your email client to finalize the request.</p>
            </div>
        </form>
      ) : (
        <div className="text-center p-10 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl">
            <h3 className="font-bold text-xl mb-2">Request Initiated!</h3>
            <p>Please check your email client to send the generated message.</p>
        </div>
      )}
    </div>
  );
};
