
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Returning Customer', value: 65.2 },
  { name: 'New Customer', value: 34.8 },
];

const COLORS = ['#F97316', '#E5E7EB'];

const ConversionsChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversions</h3>
      <div className="relative w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={100}
              startAngle={90}
              endAngle={450}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              cornerRadius={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-4xl font-bold text-gray-800">65.2%</p>
          <p className="text-gray-500">Returning Customer</p>
        </div>
      </div>
    </div>
  );
};

export default ConversionsChart;