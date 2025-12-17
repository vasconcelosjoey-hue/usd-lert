
import React, { useState } from 'react';
import { Sparkles, BrainCircuit, ArrowRight } from 'lucide-react';
import { getAIAnalysis } from '../services/geminiService';
import { AIInsight } from '../types';

interface AIAnalysisProps {
  currentRate: string;
  pctChange: string;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ currentRate, pctChange }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<AIInsight | null>(null);

  const generateInsight = async () => {
    setLoading(true);
    try {
      const result = await getAIAnalysis(currentRate, pctChange);
      setInsight(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-accent/10 blur-3xl rounded-full" />
      
      {!insight ? (
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div className="bg-accent/20 p-3 rounded-2xl">
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Análise Inteligente</h3>
            <p className="text-slate-400 text-sm mt-1">Gere uma análise de mercado baseada na cotação atual usando Gemini AI.</p>
          </div>
          <button 
            onClick={generateInsight}
            disabled={loading}
            className="mt-2 px-6 py-3 bg-accent text-slate-900 font-bold rounded-2xl hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? 'Pensando...' : 'Obter Insights'}
            {!loading && <BrainCircuit className="w-5 h-5" />}
          </button>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Insights da IA</span>
             </div>
             <button 
               onClick={() => setInsight(null)}
               className="text-xs text-slate-400 hover:text-white"
             >
               Recalcular
             </button>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg text-slate-100 leading-relaxed font-medium">
              {insight.analysis}
            </p>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start gap-3">
              <div className="bg-accent/20 p-2 rounded-xl">
                <ArrowRight className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="block text-xs text-accent font-bold uppercase mb-1">Recomendação</span>
                <p className="text-slate-200 text-sm">{insight.advice}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;
