
import React, { useState } from 'react';
import { Zap, RefreshCcw, Send, AlertCircle, MessageSquare, BrainCircuit } from 'lucide-react';
import Header from './components/Header';
import PlatformCard from './components/PlatformCard';
import Loader from './components/Loader';
import ChatPanel from './components/ChatPanel';
import ImageGenerator from './components/ImageGenerator';
import { GeneratedPost } from './types';
import { generateViralPosts } from './services/geminiService';

const App: React.FC = () => {
  const [topic, setTopic] = useState('LETSGETITAI');
  const [description, setDescription] = useState("An AI accountability coach that prevents people from quitting their fitness goals in February. It uses 3AM text nudges and behavioral science.");
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const results = await generateViralPosts(topic, description);
      if (results && results.length > 0) {
        setPosts(results);
      } else {
        throw new Error("No content was generated. Please try again.");
      }
    } catch (err: any) {
      console.error("App: Generation Error:", err);
      setError(err?.message || "Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20 selection:bg-emerald-500/30 font-sans antialiased relative overflow-x-hidden">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="p-4 bg-emerald-500 text-slate-950 rounded-full shadow-2xl shadow-emerald-500/20 hover:scale-110 transition-transform flex items-center justify-center"
        >
          <MessageSquare size={24} />
        </button>
      </div>

      <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      <div className="max-w-7xl mx-auto px-6 pt-12">
        <Header />

        {/* Strategic Control Center */}
        <section className="max-w-3xl mx-auto mb-16 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-emerald-500/5 blur-3xl rounded-full"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Brand / Topic</label>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Gemini 3 Pro Ready</span>
                </div>
                <input 
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. LETSGETITAI"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Context / Secret Sauce</label>
                <input 
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What makes this special?"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full mt-8 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black py-5 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 text-lg shadow-xl shadow-emerald-500/20 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              {loading ? (
                <>
                  <RefreshCcw size={24} className="animate-spin" />
                  Strategizing Campaign...
                </>
              ) : (
                <>
                  <Zap size={24} className="group-hover:scale-125 transition-transform" />
                  Generate Viral Campaign
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-400 animate-in fade-in zoom-in-95 duration-200">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </section>

        {/* Results Area */}
        <div className="min-h-[400px]">
          {loading ? (
            <Loader />
          ) : (
            <>
              {posts.length > 0 ? (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {posts.map((post, index) => (
                      <PlatformCard key={`${post.platform}-${index}`} post={post} />
                    ))}
                  </div>

                  {/* Asset Generation section appears only after results */}
                  <ImageGenerator defaultTopic={topic} />
                </div>
              ) : (
                <div className="text-center py-24 opacity-50 space-y-8 animate-in fade-in duration-500">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto shadow-inner relative z-10">
                      <BrainCircuit size={32} className="text-emerald-500/50" />
                    </div>
                    <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-slate-400 tracking-tight">Campaign Intelligence Offline</h3>
                    <p className="text-slate-500 mt-2 max-w-xs mx-auto">Input your brand mission to activate high-performance cross-platform strategies.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <footer className="mt-32 pb-12 pt-8 border-t border-slate-900 text-center">
          <p className="text-slate-600 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
            Unified Content Engine v2.0
          </p>
          <div className="flex items-center justify-center gap-6 text-slate-500">
             <div className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
               <span className="text-xs">Gemini 3 Pro (Analysis)</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
               <span className="text-xs">Nano Banana Pro (Vision)</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
               <span className="text-xs">Gemini 3 Flash (Speed)</span>
             </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
