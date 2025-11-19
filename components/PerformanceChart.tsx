
import React, { useState } from 'react';
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import type { PerformanceDataType } from '../types';

const data: PerformanceDataType[] = [
  { name: 'Jan', pageViews: 33, clicks: 10 },
  { name: 'Feb', pageViews: 65, clicks: 12 },
  { name: 'Mar', pageViews: 45, clicks: 10 },
  { name: 'Apr', pageViews: 68, clicks: 15 },
  { name: 'May', pageViews: 49, clicks: 20 },
  { name: 'Jun', pageViews: 60, clicks: 18 },
  { name: 'Jul', pageViews: 38, clicks: 12 },
  { name: 'Aug', pageViews: 42, clicks: 11 },
  { name: 'Sep', pageViews: 75, clicks: 22 },
  { name: 'Oct', pageViews: 51, clicks: 15 },
  { name: 'Nov', pageViews: 62, clicks: 12 },
  { name: 'Dec', pageViews: 72, clicks: 8 },
];

const PerformanceChart: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState('1Y');
    const filters = ['ALL', '1M', '6M', '1Y'];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Performance</h3>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
             {filters.map(filter => (
                 <button 
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                        activeFilter === filter ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:bg-gray-200'
                    }`}
                 >
                     {filter}
                 </button>
             ))}
        </div>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <ComposedChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} dy={10} tick={{ fill: '#6B7280' }}/>
            <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B7280' }}/>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
              }}
            />
            <Legend verticalAlign="bottom" align="right" iconType="circle" wrapperStyle={{paddingTop: '20px'}}/>
            <Bar dataKey="pageViews" name="Page Views" fill="#F97316" barSize={20} radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="clicks" name="Clicks" stroke="#10B981" strokeWidth={2} dot={{ r: 4, fill: '#10B981' }} activeDot={{ r: 6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;