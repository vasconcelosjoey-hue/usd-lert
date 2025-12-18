import React, { useState, useEffect } from 'react';
import { DollarSign, Bell, BellOff, Loader2, Settings2 } from 'lucide-react';
import { requestNotificationPermission, getFCMToken, deactivateNotifications } from '../services/firebase';

const Header: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [notificationsActive, setNotificationsActive] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('fcm_token');
    if (savedToken) setNotificationsActive(true);
  }, []);

  const handleToggleNotifications = async () => {
    setLoading(true);
    try {
      if (notificationsActive) {
        await deactivateNotifications();
        setNotificationsActive(false);
        alert('Alertas desativados.');
      } else {
        if (Notification.permission === 'denied') {
          alert('Atenção: Você bloqueou as notificações. Clique no cadeado ao lado da URL na barra de endereços para permitir novamente.');
          return;
        }

        const granted = await requestNotificationPermission();
        if (granted) {
          const token = await getFCMToken();
          if (token) {
            setNotificationsActive(true);
            alert('Sucesso! Notificações configuradas.');
          } else {
            alert('Quase lá! Falta configurar as variáveis de ambiente do Firebase no Vercel (VITE_FIREBASE_...).');
          }
        }
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao configurar notificações. Verifique se o site está rodando via HTTPS.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shrink-0">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 p-1.5 rounded-lg">
            <DollarSign className="w-4 h-4 text-accent" />
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">USD Alert</h1>
        </div>
        
        <button 
          className={`p-2 rounded-full transition-all flex items-center justify-center ${notificationsActive ? 'text-accent bg-accent/10' : 'hover:bg-slate-50 text-slate-300'}`}
          onClick={handleToggleNotifications}
          disabled={loading}
          title={notificationsActive ? "Desativar Alertas" : "Ativar Alertas"}
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
    </header>
  );
};

export default Header;