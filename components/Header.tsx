import React, { useState, useEffect } from 'react';
import { DollarSign, Bell, BellOff, Loader2, Settings2, Info } from 'lucide-react';
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
        const permission = await Notification.permission;
        if (permission === 'denied') {
          alert('Permissão negada anteriormente. Clique no cadeado na barra de endereços do navegador e ative as notificações manualmente.');
          return;
        }

        const granted = await requestNotificationPermission();
        if (granted) {
          const token = await getFCMToken();
          if (token) {
            setNotificationsActive(true);
            alert('Alertas push configurados com sucesso!');
          } else {
            alert('Falha ao obter token. Certifique-se de que as chaves VITE_FIREBASE_* estão configuradas no Vercel.');
          }
        } else {
          alert('Permissão de notificação negada.');
        }
      }
    } catch (error) {
      console.error(error);
      alert('Erro técnico: Verifique se o site possui HTTPS e se as chaves do Firebase são válidas.');
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
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 p-1.5 rounded-lg">
            <DollarSign className="w-4 h-4 text-accent" />
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">USD Alert</h1>
        </div>
        
        <div className="flex items-center gap-1">
          {notificationsActive && (
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-accent/10 text-accent' : 'hover:bg-slate-50 text-slate-500'}`}
            >
              <Settings2 className="w-4 h-4" />
            </button>
          )}
          
          <button 
            className={`p-2 rounded-full transition-all flex items-center justify-center ${loading ? 'bg-slate-50' : notificationsActive ? 'text-accent bg-accent/10' : 'hover:bg-slate-50 text-slate-300'}`}
            onClick={handleToggleNotifications}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
            ) : notificationsActive ? (
              <Bell className="w-4 h-4" />
            ) : (
              <BellOff className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {showSettings && notificationsActive && (
        <div className="bg-slate-50 border-b border-slate-200 animate-in fade-in slide-in-from-top-2">
          <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
              <Info className="w-3 h-3" />
              Alerta se variação >
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                step="0.05" 
                value={threshold} 
                onChange={handleThresholdChange}
                className="w-16 px-1.5 py-0.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <span className="text-[10px] font-bold text-slate-400">%</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;