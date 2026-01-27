import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useWeeklyIncomeData } from '@/hooks/usePlaid';
import { Loader2 } from 'lucide-react';

interface IncomeTrendChartProps {
  periodStart?: string;
  periodEnd?: string;
  monthlyAverage?: number;
}

export const IncomeTrendChart = ({ periodStart, periodEnd }: IncomeTrendChartProps) => {
  const { data: weeklyData, isLoading } = useWeeklyIncomeData(periodStart, periodEnd);
  
  // Use real data or empty array if no data
  const data = weeklyData || [];
  
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="p-6 bg-white border-t border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <div className="w-1 h-6 bg-primary rounded-full" />
        Income Trend (Last 90 Days)
      </h2>
      <div className="h-48 w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p className="text-sm">No income data available for this period</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#21A68C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#21A68C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: '#6b7280' }} 
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#6b7280' }} 
                tickFormatter={(value) => `$${value / 1000}k`}
                tickLine={false}
                axisLine={false}
                width={45}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Income']}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#21A68C" 
                strokeWidth={2}
                fill="url(#colorIncome)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default IncomeTrendChart;
