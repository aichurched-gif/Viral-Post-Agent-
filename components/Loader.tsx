
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="mt-6 text-emerald-400 font-bold animate-pulse">Running Neural Optimization...</p>
      <p className="text-slate-500 text-sm mt-2">Consulting algorithm psychology databases</p>
    </div>
  );
};

export default Loader;
