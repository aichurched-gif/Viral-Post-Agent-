
import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="mb-12 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
        <Sparkles size={16} />
        <span>Algorithm-Driven Content Engine</span>
      </div>
      <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-4">
        VIRAL<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">POST</span>AGENT
      </h1>
      <p className="text-slate-400 text-lg max-w-2xl mx-auto">
        Stop guessing. Start growing. Generate content optimized for the psychology of every major social media algorithm.
      </p>
    </header>
  );
};

export default Header;
