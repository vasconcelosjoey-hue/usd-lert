
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import QuoteCard from './components/QuoteCard';
import Chart from './components/Chart';
import AIAnalysis from './components/AIAnalysis';
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
    
    // Auto refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Cotação do Dólar
          </h2>
          <p className="text-slate-500 font-medium">
            Acompanhe o mercado financeiro em tempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12">
            <QuoteCard 
              data={rate} 
              loading={loading} 
              onRefresh={loadData} 
            />
          </div>

          <div className="lg:col-span-12">
            <Chart data={history} />
          </div>

          <div className="lg:col-span-12 mb-10">
            {rate && (
              <AIAnalysis 
                currentRate={rate.bid} 
                pctChange={rate.pctChange} 
              />
            )}
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} USD Alert. Dados via AwesomeAPI e Gemini AI.</p>
      </footer>
    </div>
  );
};

export default App;
