
import React from 'react';
import { DollarSign, Bell } from 'lucide-react';

const Header: React.FC = () => {
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
          className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
          onClick={() => alert('Recurso de alertas em desenvolvimento para Firebase.')}
        >
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
