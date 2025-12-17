
import { EXCHANGE_API_URL, HISTORY_API_URL } from '../constants';
import { ExchangeRate, ChartData } from '../types';

export const fetchCurrentRate = async (): Promise<ExchangeRate> => {
  const response = await fetch(EXCHANGE_API_URL);
  const data = await response.json();
  return data.USDBRL;
};

export const fetchHistory = async (): Promise<ChartData[]> => {
  const response = await fetch(HISTORY_API_URL);
  const data = await response.json();
  // We get an array of rates, need to reverse and map to ChartData
  return data.map((item: any) => ({
    time: new Date(item.timestamp * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    value: parseFloat(item.bid)
  })).reverse();
};
