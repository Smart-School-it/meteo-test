
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import SearchBar from './components/SearchBar';
import WeatherResult from './components/WeatherResult';
import { geminiWeatherService } from './services/geminiService';
import { WeatherData, HistoryItem } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('meteo_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    setWeatherData(null); // Pulisci i dati precedenti durante la ricerca
    try {
      const result = await geminiWeatherService.fetchWeather(city);
      setWeatherData(result);
      
      const newHistory = [
        { city: result.city, timestamp: new Date().toLocaleDateString() },
        ...history.filter(h => h.city.toLowerCase() !== result.city.toLowerCase())
      ].slice(0, 5);
      
      setHistory(newHistory);
      localStorage.setItem('meteo_history', JSON.stringify(newHistory));
    } catch (err: any) {
      setError(err.message || "Qualcosa è andato storto nella comunicazione con l'IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center pt-10 pb-4 min-h-[60vh]">
        <div className="text-center mb-12 animate-in fade-in duration-1000">
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">
            Il tuo <span className="text-blue-600">Meteorologo Personale</span> AI
          </h2>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
            Scopri previsioni precise e consigli intelligenti per ogni città del mondo.
          </p>
        </div>
        
        <SearchBar onSearch={handleSearch} isLoading={loading} />

        {error && (
          <div className="w-full max-w-2xl px-6 py-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-3 mb-8 animate-in slide-in-from-top-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span className="font-medium text-sm md:text-base">{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center py-20">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <p className="text-slate-400 font-medium animate-pulse">L'IA sta elaborando i dati satellitari...</p>
          </div>
        )}

        {weatherData && !loading && <WeatherResult data={weatherData} />}

        {!weatherData && !loading && (
          <div className="w-full max-w-4xl mt-12">
            {history.length > 0 ? (
              <div className="max-w-2xl mx-auto">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Ricerche Recenti</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {history.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearch(item.city)}
                      className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-lg transition-all text-left group"
                    >
                      <div>
                        <span className="block font-bold text-slate-700 group-hover:text-blue-600 capitalize">{item.city}</span>
                        <span className="text-xs text-slate-400">{item.timestamp}</span>
                      </div>
                      <svg className="text-slate-300 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: "Meteo AI", desc: "Report generati in tempo reale utilizzando modelli linguistici avanzati.", icon: "🌤️" },
                  { title: "Consigli Veri", desc: "Non solo temperature, ma suggerimenti su come affrontare la giornata.", icon: "🧠" },
                  { title: "Sempre Connesso", desc: "Dati estratti dal web per garantirti l'accuratezza massima.", icon: "🌐" }
                ].map((feature, i) => (
                  <div key={i} className="bg-white/50 p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h4 className="font-bold text-slate-800 mb-2">{feature.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
