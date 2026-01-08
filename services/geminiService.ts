
import { GoogleGenAI } from "@google/genai";
import { WeatherData, GroundingSource } from "../types";

export class GeminiWeatherService {
  private getAIInstance() {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === 'undefined') {
      throw new Error("Chiave API non configurata. Imposta API_KEY nelle variabili d'ambiente di Vercel.");
    }
    return new GoogleGenAI({ apiKey });
  }

  async fetchWeather(city: string): Promise<WeatherData> {
    const prompt = `Fornisci un report meteo dettagliato per la città di "${city}". 
    Il report deve includere:
    1. Condizioni attuali (Temperatura reale e percepita, Umidità, Vento, Visibilità).
    2. Previsioni per le prossime 24 ore.
    3. Previsioni sintetiche per i prossimi 5 giorni.
    4. Un consiglio personalizzato basato sul meteo (es: vestiario consigliato, attività all'aperto, o se è meglio restare a casa).
    5. Curiosità climatica sulla zona se pertinente.
    
    Formatta la risposta in Markdown elegante, usando emoji e tabelle dove opportuno per la chiarezza.`;

    try {
      const ai = this.getAIInstance();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "Nessun dato ricevuto.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      const sources: GroundingSource[] = chunks.map((chunk: any) => ({
        web: chunk.web ? { uri: chunk.web.uri, title: chunk.web.title } : undefined,
        maps: chunk.maps ? { uri: chunk.maps.uri, title: chunk.maps.title } : undefined,
      }));

      return {
        city,
        content: text,
        sources,
        timestamp: new Date().toLocaleTimeString(),
      };
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      if (error.message?.includes("API_KEY")) {
        throw error;
      }
      throw new Error("Errore durante il recupero dei dati. Verifica la tua chiave API.");
    }
  }
}

export const geminiWeatherService = new GeminiWeatherService();
