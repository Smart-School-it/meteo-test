
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

  // Load history from local storage on mount
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
    try {
      const result = await geminiWeatherService.fetchWeather(city);
      setWeatherData(result);
      
      // Update history
      const newHistory = [
        { city: result.city, timestamp: new Date().toLocaleDateString() },
        ...history.filter(h => h.city.toLowerCase() !== result.city.toLowerCase())
      ].slice(0, 5);
      
      setHistory(newHistory);
      localStorage.setItem('meteo_history', JSON.stringify(newHistory));
    } catch (err: any) {
      setError(err.message || "Qualcosa è andato storto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center pt-10 pb-4">
        <h2 className="text-4xl md:text-5xl font-black text-slate-800 text-center mb-4 tracking-tight">
          Il tuo <span className="text-blue-600">Meteorologo Personale</span> AI
        </h2>
        <p className="text-slate-500 text-lg md:text-xl text-center max-w-2xl mb-12">
          Scopri le previsioni meteo precise potenziate dall'intelligenza artificiale di Google Gemini.
        </p>
        
        <SearchBar onSearch={handleSearch} isLoading={loading} />

        {error && (
          <div className="w-full max-w-2xl px-6 py-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-3 mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {loading && !weatherData && (
          <div className="flex flex-col items-center py-20 animate-pulse">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <p className="text-slate-400 font-medium">L'IA sta consultando i satelliti meteo...</p>
          </div>
        )}

        {weatherData && <WeatherResult data={weatherData} />}

        {!weatherData && !loading && history.length > 0 && (
          <div className="w-full max-w-2xl mt-10">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Ricerche Recenti</h3>
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
        )}

        {!weatherData && !loading && history.length === 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
            {[
              { title: "Meteo in tempo reale", desc: "Dati aggiornati ogni minuto grazie alla ricerca intelligente di Google.", icon: "🛰️" },
              { title: "Consigli Personalizzati", desc: "Non solo numeri: l'IA ti dice se è la giornata giusta per una passeggiata.", icon: "🤖" },
              { title: "Grounding Verificato", desc: "Ogni dato è supportato da fonti web reali e affidabili.", icon: "✅" }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="font-bold text-slate-800 mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
