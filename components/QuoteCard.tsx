
import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { ExchangeRate } from '../types';

interface QuoteCardProps {
  data: ExchangeRate | null;
  loading: boolean;
  onRefresh: () => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ data, loading, onRefresh }) => {
  if (!data || loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 animate-pulse">
        <div className="h-4 w-24 bg-slate-100 rounded mb-4" />
        <div className="h-12 w-48 bg-slate-100 rounded" />
      </div>
    );
  }

  const isUp = parseFloat(data.pctChange) >= 0;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4">
        <button 
          onClick={onRefresh}
          className="p-2 text-slate-400 hover:text-slate-900 transition-all active:rotate-180 duration-500"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Dólar Comercial</span>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black text-slate-900">
            R$ {parseFloat(data.bid).toFixed(3)}
          </span>
          <div className={`flex items-center gap-1 text-sm font-bold px-2 py-0.5 rounded-full ${isUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
            {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {data.pctChange}%
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-4">
          Última atualização: {new Date(data.create_date).toLocaleTimeString('pt-BR')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-50">
        <div>
          <span className="block text-xs text-slate-400 uppercase">Mínima</span>
          <span className="font-semibold text-slate-700">R$ {parseFloat(data.low).toFixed(3)}</span>
        </div>
        <div>
          <span className="block text-xs text-slate-400 uppercase">Máxima</span>
          <span className="font-semibold text-slate-700">R$ {parseFloat(data.high).toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;
