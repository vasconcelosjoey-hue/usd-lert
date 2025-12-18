import React from 'react';
import { RefreshCw, ArrowUpRight, ArrowDownRight, Clock, Wallet, BarChart3 } from 'lucide-react';
import { ExchangeRate } from '../types';

interface QuoteCardProps {
  data: ExchangeRate | null;
  loading: boolean;
  onRefresh: () => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ data, loading, onRefresh }) => {
  if (!data || loading) {
    return <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse h-44" />;
  }

  const isUp = parseFloat(data.pctChange) >= 0;
  const varBrl = parseFloat(data.varBid);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50 relative overflow-hidden shrink-0">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Compra Comercial</span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
              R$ {parseFloat(data.bid).toFixed(3)}
            </h2>
            <div className={`flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-md ${isUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
              {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {data.pctChange}%
            </div>
          </div>
        </div>
        <button onClick={onRefresh} className="p-2 text-slate-200 hover:text-slate-900 transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-accent' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
          <div className="bg-white p-1.5 rounded-lg shadow-xs">
            <Wallet className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div>
            <span className="text-[8px] text-slate-400 uppercase font-black block leading-none">Venda</span>
            <span className="text-xs font-bold text-slate-700 leading-none">R$ {parseFloat(data.ask).toFixed(3)}</span>
          </div>
        </div>
        
        <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
          <div className="bg-white p-1.5 rounded-lg shadow-xs">
            <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div>
            <span className="text-[8px] text-slate-400 uppercase font-black block leading-none">Var. Dia</span>
            <span className={`text-xs font-bold leading-none ${varBrl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {varBrl >= 0 ? '+' : ''}{varBrl.toFixed(4)}
            </span>
          </div>
        </div>

        <div className="col-span-2 flex items-center justify-between px-2 pt-1 border-t border-slate-100/50">
          <div className="flex gap-4">
             <div>
                <span className="text-[8px] text-slate-300 uppercase font-black">Mínima</span>
                <span className="text-[10px] font-bold text-slate-500 block">R$ {parseFloat(data.low).toFixed(3)}</span>
             </div>
             <div>
                <span className="text-[8px] text-slate-300 uppercase font-black">Máxima</span>
                <span className="text-[10px] font-bold text-slate-500 block">R$ {parseFloat(data.high).toFixed(3)}</span>
             </div>
          </div>
          <div className="flex items-center gap-1 text-[8px] text-slate-300 font-bold">
            <Clock className="w-2.5 h-2.5" />
            {new Date(data.create_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;