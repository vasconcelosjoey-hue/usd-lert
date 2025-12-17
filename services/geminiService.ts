
import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODEL } from "../constants";
import { AIInsight } from "../types";

export const getAIAnalysis = async (currentRate: string, pctChange: string): Promise<AIInsight> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analise a cotação atual do Dólar (USD/BRL): R$ ${currentRate} com variação de ${pctChange}%. 
  Forneça uma análise curta e um conselho para quem quer comprar ou vender dólares hoje.`;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          trend: { 
            type: Type.STRING, 
            description: "A tendência: 'up', 'down' ou 'neutral'" 
          },
          analysis: { 
            type: Type.STRING, 
            description: "Uma breve análise do cenário atual (máximo 2 parágrafos)" 
          },
          advice: { 
            type: Type.STRING, 
            description: "Conselho prático: comprar, vender ou aguardar." 
          }
        },
        required: ["trend", "analysis", "advice"],
      },
    },
  });

  try {
    return JSON.parse(response.text || '{}') as AIInsight;
  } catch (error) {
    console.error("Erro ao processar insight da IA:", error);
    return {
      trend: 'neutral',
      analysis: 'Não foi possível gerar uma análise detalhada no momento.',
      advice: 'Consulte especialistas financeiros antes de tomar decisões.'
    };
  }
};
