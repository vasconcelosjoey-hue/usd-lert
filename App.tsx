import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import QuoteCard from './components/QuoteCard';
import Chart from './components/Chart';
import { fetchCurrentRate, fetchHistory } from './services/exchangeService';
import { ExchangeRate, ChartData } from './types';

const App: React.FC = () => {
  const [rate, setRate] = useState<ExchangeRate | null>(null);
  const [history, setHistory] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [current, hist] = await Promise.all([
        fetchCurrentRate(),
        fetchHistory()
      ]);
      setRate(current);
      setHistory(hist);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 45000); // 45s refresh
    return () => clearInterval(interval);
  }, [loadData]);

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <Header />
      
      <main className="flex-1 overflow-y-auto sm:overflow-hidden w-full max-w-4xl mx-auto px-4 py-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Dashboard Financeiro
          </h2>
          <p className="text-[11px] text-slate-400 font-medium">
            Monitoramento em tempo real do par USD/BRL.
          </p>
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <QuoteCard 
            data={rate} 
            loading={loading} 
            onRefresh={loadData} 
          />

          <div className="flex-1 min-h-[220px]">
            <Chart data={history} />
          </div>
        </div>
      </main>

      <footer className="py-3 border-t border-slate-100 bg-white text-center">
        <p className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">
          Powered By JoI.A.
        </p>
      </footer>
    </div>
  );
};

export default App;