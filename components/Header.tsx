import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Bell, 
  BellOff, 
  Loader2, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { requestNotificationPermission, getFCMToken, deactivateNotifications, isMessagingSupported } from '../services/firebase';

const Header: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [notificationsActive, setNotificationsActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    isMessagingSupported().then(setSupported);
    const savedToken = localStorage.getItem('fcm_token');
    if (savedToken) {
      setNotificationsActive(true);
    }
  }, []);

  const handleToggleNotifications = async () => {
    setLoading(true);
    setApiError(false);
    try {
      if (notificationsActive) {
        await deactivateNotifications();
        setNotificationsActive(false);
      } else {
        const granted = await requestNotificationPermission();
        if (granted) {
          const token = await getFCMToken();
          if (token) {
            setNotificationsActive(true);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 4000);
          }
        } else {
          alert('Permissão negada. Ative as notificações nas configurações do navegador.');
        }
      }
    } catch (error: any) {
      console.error("Erro FCM:", error);
      if (error.message === "API_NOT_ENABLED" || error.message?.includes('403')) {
        setApiError(true);
      } else {
        alert(`Erro: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (supported === false) return (
    <header className="w-full bg-white border-b border-slate-100 p-2 text-center text-[10px] text-slate-400">
      Notificações push não suportadas neste navegador.
    </header>
  );

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shrink-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 p-1.5 rounded-lg">
            <DollarSign className="w-4 h-4 text-accent" />
          </div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight">USD Alert</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {apiError && (
            <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 animate-pulse">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              <span className="text-[9px] font-bold text-amber-700">Erro 403 / API</span>
            </div>
          )}

          {showSuccess && (
            <span className="text-[10px] font-bold text-accent animate-bounce flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> OK!
            </span>
          )}

          <button 
            className={`p-2.5 rounded-full transition-all flex items-center justify-center shadow-sm ${notificationsActive ? 'text-white bg-accent ring-4 ring-accent/10' : 'bg-slate-50 text-slate-300 border border-slate-200'}`}
            onClick={handleToggleNotifications}
            disabled={loading || supported === null}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : notificationsActive ? (
              <Bell className="w-5 h-5 fill-current" />
            ) : (
              <BellOff className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;