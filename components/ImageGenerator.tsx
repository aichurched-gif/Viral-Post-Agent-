
import React, { useState } from 'react';
import { ImageIcon, Wand2, Download, AlertCircle, RefreshCcw } from 'lucide-react';
import { generateVisualAsset } from '../services/geminiService';
import { ImageSize } from '../types';

interface ImageGeneratorProps {
  defaultTopic: string;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ defaultTopic }) => {
  const [prompt, setPrompt] = useState(`A high-retention social media thumbnail for ${defaultTopic}, vibrant colors, emotional face, attention-grabbing text overlay`);
  const [size, setSize] = useState<ImageSize>('1K');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    // Check for API key selection
    if (typeof window.aistudio !== 'undefined') {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const url = await generateVisualAsset(prompt, size);
      setImageUrl(url);
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        setError("API Key Error. Please re-select your key.");
        window.aistudio?.openSelectKey();
      } else {
        setError(err.message || "Failed to generate image.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
          <ImageIcon size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Visual Asset Generator</h2>
          <p className="text-slate-500 text-sm">Create high-impact thumbnails and post graphics</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Image Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all h-24 resize-none"
            placeholder="Describe the visual hook..."
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Resolution Quality</label>
            <div className="flex gap-2">
              {(['1K', '2K', '4K'] as ImageSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                    size === s ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full md:w-auto px-8 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-black py-3 rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            {loading ? <RefreshCcw size={18} className="animate-spin" /> : <Wand2 size={18} />}
            {loading ? 'Designing...' : 'Generate Asset'}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {imageUrl && (
          <div className="mt-8 relative group animate-in zoom-in-95 duration-500">
            <img src={imageUrl} alt="Generated Asset" className="w-full rounded-2xl shadow-2xl border border-slate-800" />
            <div className="absolute top-4 right-4 flex gap-2">
              <a 
                href={imageUrl} 
                download="viral-asset.png"
                className="bg-slate-950/80 backdrop-blur-md p-3 rounded-xl text-white hover:bg-slate-900 transition-colors shadow-xl"
              >
                <Download size={20} />
              </a>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
