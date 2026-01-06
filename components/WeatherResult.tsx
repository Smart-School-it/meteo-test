
import React from 'react';
import { WeatherData } from '../types';

interface WeatherResultProps {
  data: WeatherData;
}

const WeatherResult: React.FC<WeatherResultProps> = ({ data }) => {
  // Simple markdown renderer helper for this demo
  const renderMarkdown = (text: string) => {
    // Note: In a production app, use a robust library like react-markdown.
    // Here we use a basic approach for visual fidelity within the prompt.
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-6 mb-2 text-slate-800">{line.replace('### ', '')}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-blue-700 border-b pb-1">{line.replace('## ', '')}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-extrabold mt-10 mb-6 text-slate-900">{line.replace('# ', '')}</h1>;
      if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-5 list-disc text-slate-600 mb-1">{line.substring(2)}</li>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-slate-700 mb-3 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="glass-card rounded-3xl p-6 md:p-10 shadow-2xl border-white/40 mb-10 overflow-hidden relative">
        {/* Dynamic header background based on city name (aesthetic filler) */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600"></div>
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-1">Previsioni AI per</h2>
            <h1 className="text-4xl font-black text-slate-800 capitalize">{data.city}</h1>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-tighter">Aggiornato alle</p>
            <p className="text-lg font-mono font-medium text-slate-600">{data.timestamp}</p>
          </div>
        </div>

        <div className="prose max-w-none">
          {renderMarkdown(data.content)}
        </div>

        {data.sources.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Fonti e Approfondimenti</h4>
            <div className="flex flex-wrap gap-3">
              {data.sources.map((source, idx) => {
                const link = source.web || source.maps;
                if (!link) return null;
                return (
                  <a
                    key={idx}
                    href={link.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:bg-white hover:text-blue-600 hover:border-blue-400 hover:shadow-md transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    {link.title || 'Sito Web'}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherResult;
