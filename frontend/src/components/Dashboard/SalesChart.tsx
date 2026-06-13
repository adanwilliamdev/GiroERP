import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface SalesChartProps {
  data: Array<{ date: string; sales: number; revenue: number }>;
  type?: 'line' | 'area' | 'bar';
}

export const SalesChart: React.FC<SalesChartProps> = ({ data, type = 'area' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        Sem dados para exibir
      </div>
    );
  }

  const commonProps = {
    data,
    margin: { top: 10, right: 30, left: 0, bottom: 0 },
  };

  const renderChart = () => {
    switch(type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#d946ef" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revenue" fill="#d946ef" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      default:
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="sales" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} />
            <Area type="monotone" dataKey="revenue" stackId="2" stroke="#d946ef" fill="#d946ef" fillOpacity={0.3} />
          </AreaChart>
        );
    }
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      {renderChart()}
    </ResponsiveContainer>
  );
};