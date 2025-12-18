import React, { useState, useEffect } from 'react';
import { DollarSign, Bell, BellOff, Loader2, Settings2 } from 'lucide-react';
import { requestNotificationPermission, getFCMToken, deactivateNotifications } from '../services/firebase';

const Header: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [notificationsActive, setNotificationsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [threshold, setThreshold] = useState('0.30');

  useEffect(() => {
    const savedToken = localStorage.getItem('fcm_token');
    const savedThreshold = localStorage.getItem('alert_threshold');
    if (savedToken) setNotificationsActive(true);
    if (savedThreshold) setThreshold(savedThreshold);
  }, []);

  const handleToggleNotifications = async () => {
    setLoading(true);
    try {
      if (notificationsActive) {
        await deactivateNotifications();
        setNotificationsActive(false);
        alert('Alertas desativados.');
      } else {
        const granted = await requestNotificationPermission();
        if (granted) {
          const token = await getFCMToken();
          if (token) {
            setNotificationsActive(true);
            alert('Alertas push ativados!');
          } else {
            alert('Falha ao obter token. Verifique as configurações do Firebase.');
          }
        } else {
          alert('Permissão de notificação negada pelo navegador.');
        }
      }
    } catch (error) {
      console.error(error);
      alert('Erro técnico ao configurar notificações.');
    } finally {
      setLoading(false);
    }
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setThreshold(val);
    localStorage.setItem('alert_threshold', val);
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
        
        <div className="flex items-center gap-2">
          {notificationsActive && (
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-accent/10 text-accent' : 'hover:bg-slate-100 text-slate-600'}`}
              title="Ajustar Limiar de Alerta"
            >
              <Settings2 className="w-5 h-5" />
            </button>
          )}
          
          <button 
            className={`p-2 rounded-full transition-all flex items-center justify-center ${loading ? 'bg-slate-100' : notificationsActive ? 'text-accent bg-accent/10' : 'hover:bg-slate-100 text-slate-400'}`}
            onClick={handleToggleNotifications}
            disabled={loading}
            title={notificationsActive ? "Desativar alertas push" : "Ativar alertas push"}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-accent" />
            ) : notificationsActive ? (
              <Bell className="w-5 h-5" />
            ) : (
              <BellOff className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {showSettings && notificationsActive && (
        <div className="bg-white border-b border-slate-200 animate-in">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-600">
              Notificar se variar mais que:
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                step="0.01" 
                min="0.01"
                value={threshold} 
                onChange={handleThresholdChange}
                className="w-20 px-2 py-1 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <span className="text-sm font-bold text-slate-400">%</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;