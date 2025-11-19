
import React from 'react';
import type { StatCardType } from '../types';
import { TrendingUpIcon, TrendingDownIcon } from './icons';

const StatCard: React.FC<StatCardType> = ({ title, value, icon: Icon, trend, trendDirection, period }) => {
  const isUp = trendDirection === 'up';
  const trendColor = isUp ? 'text-green-500' : 'text-red-500';
  const TrendIcon = isUp ? TrendingUpIcon : TrendingDownIcon;
  const iconBgColor = isUp ? 'bg-orange-100' : 'bg-red-100';


  return (
    <div className="bg-white p-5 rounded-xl shadow-md flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
          <Icon className="h-6 w-6 text-orange-500" />
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="flex items-center">
          <TrendIcon className={`h-4 w-4 mr-1 ${trendColor}`} />
          <span className={`${trendColor} font-semibold`}>{trend}</span>
          <span className="text-gray-500 ml-1">{period}</span>
        </div>
        <a href="#" className="text-gray-500 hover:text-gray-800 font-medium">
          View More
        </a>
      </div>
    </div>
  );
};

export default StatCard;