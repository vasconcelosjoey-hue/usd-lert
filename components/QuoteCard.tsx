import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { ExchangeRate } from '../types';

interface QuoteCardProps {
  data: ExchangeRate | null;
  loading: boolean;
  onRefresh: () => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ data, loading, onRefresh }) => {
  if (!data || loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse h-48" />
    );
  }

  const isUp = parseFloat(data.pctChange) >= 0;
  const varBrl = parseFloat(data.varBid);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/40 border border-slate-50 relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Dólar Comercial (Compra)</span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
              R$ {parseFloat(data.bid).toFixed(3)}
            </h2>
            <div className={`flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-md ${isUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
              {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {data.pctChange}%
            </div>
          </div>
        </div>
        <button 
          onClick={onRefresh}
          className="p-1.5 text-slate-300 hover:text-slate-900 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-accent' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
        <div>
          <span className="text-[9px] text-slate-400 uppercase font-bold block">Venda (Ask)</span>
          <span className="text-sm font-bold text-slate-700">R$ {parseFloat(data.ask).toFixed(3)}</span>
        </div>
        <div>
          <span className="text-[9px] text-slate-400 uppercase font-bold block">Variação (R$)</span>
          <span className={`text-sm font-bold ${varBrl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {varBrl >= 0 ? '+' : ''}{varBrl.toFixed(4)}
          </span>
        </div>
        <div>
          <span className="text-[9px] text-slate-400 uppercase font-bold block">Mínima</span>
          <span className="text-sm font-bold text-slate-600">R$ {parseFloat(data.low).toFixed(3)}</span>
        </div>
        <div>
          <span className="text-[9px] text-slate-400 uppercase font-bold block">Máxima</span>
          <span className="text-sm font-bold text-slate-600">R$ {parseFloat(data.high).toFixed(3)}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 text-[9px] text-slate-400 mt-4 justify-end">
        <Clock className="w-3 h-3" />
        Atualizado às {new Date(data.create_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
    </div>
  );
};

export default QuoteCard;