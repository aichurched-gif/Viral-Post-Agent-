
import React, { useState } from 'react';
import { Copy, Share2, TrendingUp, Check, Info, BrainCircuit, Wand2, RefreshCcw } from 'lucide-react';
import { GeneratedPost } from '../types';
import { deepAnalyzeContent, refinePostWithAI } from '../services/geminiService';

interface PlatformCardProps {
  post: GeneratedPost;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ post }) => {
  const [content, setContent] = useState(post.content);
  const [copied, setCopied] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [refining, setRefining] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeepAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await deepAnalyzeContent(content);
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRefine = async () => {
    const feedback = prompt("How should we refine this? (e.g., 'More controversial', 'Shorten for higher speed', 'Add more emojis')");
    if (!feedback) return;

    setRefining(true);
    try {
      const refined = await refinePostWithAI(content, feedback);
      setContent(refined);
    } catch (err) {
      console.error(err);
    } finally {
      setRefining(false);
    }
  };

  return (
    <div className="group relative flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 shadow-xl hover:shadow-emerald-500/10">
      <div className="p-5 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{post.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">{post.name}</h3>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Algorithm Target</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <TrendingUp size={14} className="text-emerald-400" />
          <span className="text-emerald-400 font-bold text-sm">{post.virality_score}%</span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-4">
        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/50 flex-1 min-h-[180px] relative group/content">
          <div className="absolute top-2 right-2 opacity-0 group-hover/content:opacity-100 transition-opacity flex gap-2">
             <button 
               onClick={handleRefine}
               disabled={refining}
               className="p-1.5 bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-400 text-slate-400 rounded-md transition-all shadow-lg"
               title="Refine with AI"
             >
               {refining ? <RefreshCcw size={14} className="animate-spin" /> : <Wand2 size={14} />}
             </button>
          </div>
          <p className="text-slate-200 whitespace-pre-wrap text-sm leading-relaxed font-mono">
            {content}
          </p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={handleDeepAnalysis}
            disabled={analyzing}
            className="w-full flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-emerald-500/30 transition-all text-xs font-bold text-emerald-400"
          >
            {analyzing ? <RefreshCcw size={14} className="animate-spin" /> : <BrainCircuit size={14} />}
            {analyzing ? 'Thinking Deeply...' : 'Deep Algorithm Analysis'}
          </button>

          {analysis && (
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-[11px] text-slate-300 leading-normal animate-in fade-in zoom-in-95">
              <span className="block font-black text-emerald-400 mb-1 uppercase tracking-widest">Neural Teardown:</span>
              {analysis}
            </div>
          )}

          {!analysis && (
            <div className="flex items-start gap-2 p-3 bg-slate-800/30 rounded-lg border border-slate-800">
              <Info size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Strategy Hook</p>
                <p className="text-xs text-slate-300 italic leading-relaxed">{post.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 pt-0 mt-auto flex gap-3">
        <button
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 ${
            copied 
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
              : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
          }`}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button className="bg-slate-800 hover:bg-slate-700 text-slate-100 p-3 rounded-xl transition-colors">
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default PlatformCard;
