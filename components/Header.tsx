import React, { useState, useEffect } from 'react';
import { DollarSign, Bell, BellOff, Loader2, CheckCircle2 } from 'lucide-react';
import { requestNotificationPermission, getFCMToken, deactivateNotifications } from '../services/firebase';

const Header: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [notificationsActive, setNotificationsActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('fcm_token');
    if (savedToken) {
      setNotificationsActive(true);
    }
  }, []);

  const handleToggleNotifications = async () => {
    setLoading(true);
    console.log("Iniciando processo de notificação...");
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
            console.log("TOKEN GERADO COM SUCESSO:", token);
            setTimeout(() => setShowSuccess(false), 4000);
          } else {
            alert('Não foi possível gerar o identificador de notificações. Tente atualizar a página.');
          }
        } else {
          alert('Permissão de notificação negada. Verifique as configurações do seu navegador ao lado da barra de endereço.');
        }
      }
    } catch (error: any) {
      console.error("Erro no processo de ativação:", error);
      alert(`Falha na ativação: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

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
          {showSuccess && (
            <span className="text-[10px] font-bold text-emerald-500 animate-pulse flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Conectado ao Firebase
            </span>
          )}
          <button 
            className={`p-2.5 rounded-full transition-all flex items-center justify-center ${notificationsActive ? 'text-accent bg-accent/10 border border-accent/20' : 'bg-slate-50 text-slate-300 border border-transparent'}`}
            onClick={handleToggleNotifications}
            disabled={loading}
            title={notificationsActive ? "Desativar alertas" : "Ativar alertas de preço"}
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
    </header>
  );
};

export default Header;