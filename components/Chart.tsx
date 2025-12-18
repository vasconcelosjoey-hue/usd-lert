import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartData } from '../types';

interface ChartProps {
  data: ChartData[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 h-full flex flex-col">
      <h3 className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2 px-1">Tendência 7 Dias</h3>
      <div className="flex-1 min-h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -35, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="time" hide={false} tick={{fill: '#cbd5e1', fontSize: 9, fontWeight: 700}} axisLine={false} tickLine={false} dy={5} />
            <YAxis hide={true} domain={['dataMin - 0.05', 'dataMax + 0.05']} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 700 }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#colorValue)" animationDuration={1500} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;