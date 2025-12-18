import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartData } from '../types';

interface ChartProps {
  data: ChartData[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 mt-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Variação nos últimos 7 dias</h3>
      {/* Container com altura mínima explícita para o ResponsiveContainer */}
      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 12}}
              dy={10}
            />
            <YAxis 
              hide={true} 
              domain={['dataMin - 0.05', 'dataMax + 0.05']} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ color: '#64748b' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#0ea5e9" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;