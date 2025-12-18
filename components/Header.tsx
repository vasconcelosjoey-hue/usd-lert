import React, { useState } from 'react';
import { DollarSign, Bell, BellOff, Loader2 } from 'lucide-react';
import { requestNotificationToken } from '../services/firebase';

const Header: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleNotificationRequest = async () => {
    setLoading(true);
    try {
      const token = await requestNotificationToken();
      if (token) {
        console.log('FCM Token:', token);
        alert('Notificações ativadas com sucesso! Token gerado (veja o console para detalhes).');
      } else {
        alert('Permissão de notificação negada ou erro ao gerar token.');
      }
    } catch (error) {
      alert('Erro ao configurar notificações.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 p-2 rounded-lg">
            <DollarSign className="w-5 h-5 text-accent" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">USD Alert</h1>
        </div>
        
        <button 
          className={`p-2 rounded-full transition-all ${loading ? 'bg-slate-100' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'}`}
          onClick={handleNotificationRequest}
          disabled={loading}
          title="Ativar alertas de cotação"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-accent" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;