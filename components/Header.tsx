import React, { useState, useEffect } from 'react';
import { DollarSign, Bell, BellOff, Loader2 } from 'lucide-react';
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
        const granted = await requestNotificationPermission();
        if (granted) {
          const token = await getFCMToken();
          if (token) {
            setNotificationsActive(true);
            alert('Notificações ativadas com sucesso!');
          }
        } else {
          alert('Permissão de notificação negada no navegador.');
        }
      }
    } catch (error: any) {
      const errorMsg = error.message || '';
      
      if (errorMsg.includes('API key not valid') || errorMsg.includes('400')) {
        alert(
          "A chave parece correta, mas o Google está bloqueando o acesso.\n\n" +
          "RESOLUÇÃO:\n" +
          "1. Vá ao Google Cloud Console > APIs e Serviços > Credenciais.\n" +
          "2. Clique na sua chave (Browser Key).\n" +
          "3. Em 'Restrições de API', verifique se a 'Firebase Installations API' e 'Cloud Messaging' estão permitidas.\n" +
          "4. Em 'Restrições de Aplicativo', verifique se o domínio 'usd-alert.vercel.app' está na lista."
        );
      } else {
        alert('Erro: ' + errorMsg);
      }
      console.error("Erro completo do Firebase:", error);
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
        
        <button 
          className={`p-2.5 rounded-full transition-all flex items-center justify-center ${notificationsActive ? 'text-accent bg-accent/10 border border-accent/20' : 'bg-slate-50 text-slate-300 border border-transparent'}`}
          onClick={handleToggleNotifications}
          disabled={loading}
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
    </header>
  );
};

export default Header;