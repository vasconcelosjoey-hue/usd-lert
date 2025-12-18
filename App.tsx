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
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [loadData]);

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <Header />
      
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-3 flex flex-col gap-3 overflow-hidden">
        <div className="shrink-0">
          <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">Câmbio Agora</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Dólar Americano (USD/BRL)</p>
        </div>

        <QuoteCard 
          data={rate} 
          loading={loading} 
          onRefresh={loadData} 
        />

        <div className="flex-1 min-h-0">
          <Chart data={history} />
        </div>
      </main>

      <footer className="py-2 border-t border-slate-100 bg-white text-center shrink-0">
        <p className="text-[9px] font-black text-slate-300 tracking-[0.2em] uppercase">
          Powered By JoI.A.
        </p>
      </footer>
    </div>
  );
};

export default App;