
export interface ExchangeRate {
  code: string;
  codein: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string;
  ask: string;
  timestamp: string;
  create_date: string;
}

export interface ChartData {
  time: string;
  value: number;
}

export interface AIInsight {
  trend: 'up' | 'down' | 'neutral';
  analysis: string;
  advice: string;
}
