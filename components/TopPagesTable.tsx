
import React from 'react';
import type { TopPageType } from '../types';

const topPagesData: TopPageType[] = [
  { path: 'larkon/ecommerce.html', views: 465, exitRate: 4.4 },
  { path: 'larkon/dashboard.html', views: 426, exitRate: 20.4 },
  { path: 'larkon/chat.html', views: 254, exitRate: 12.25 },
  { path: 'larkon/auth-login.html', views: 3369, exitRate: 5.2 },
];

const ExitRate: React.FC<{ rate: number }> = ({ rate }) => {
  let bgColor = 'bg-green-100';
  let textColor = 'text-green-800';

  if (rate > 10 && rate <= 20) {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
  } else if (rate > 20) {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
  }

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${bgColor} ${textColor}`}>
      {rate}%
    </span>
  );
};

const TopPagesTable: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Top Pages</h3>
        <button className="text-sm font-medium text-orange-500 bg-orange-100 hover:bg-orange-200 px-3 py-1 rounded-lg">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3">
                Page Path
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Page Views
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                Exit Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {topPagesData.map((page) => (
              <tr key={page.path} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {page.path}
                </td>
                <td className="px-4 py-4 text-center">
                  {page.views.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-center">
                  <ExitRate rate={page.exitRate} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopPagesTable;