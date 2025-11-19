
import React from 'react';
import StatCard from '../components/StatCard';
import PerformanceChart from '../components/PerformanceChart';
import ConversionsChart from '../components/ConversionsChart';
import SessionsByCountry from '../components/SessionsByCountry';
import TopPagesTable from '../components/TopPagesTable';
import { 
  ShoppingBagIcon, 
  UsersIcon,
  CurrencyDollarIcon,
  TagIcon,
} from '../components/icons';
import type { StatCardType } from '../types';

const statCardsData: StatCardType[] = [
  {
    title: 'Total Orders',
    value: '13,647',
    icon: ShoppingBagIcon,
    trend: '2.3%',
    trendDirection: 'up',
    period: 'Last Week',
  },
  {
    title: 'New Leads',
    value: '9,526',
    icon: UsersIcon,
    trend: '8.1%',
    trendDirection: 'up',
    period: 'Last Month',
  },
  {
    title: 'Deals',
    value: '976',
    icon: TagIcon,
    trend: '0.3%',
    trendDirection: 'down',
    period: 'Last Month',
  },
  {
    title: 'Booked Revenue',
    value: '$123.6k',
    icon: CurrencyDollarIcon,
    trend: '10.6%',
    trendDirection: 'down',
    period: 'Last Month',
  },
];

const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-6 rounded-md" role="alert">
        <p>We regret to inform you that our server is currently experiencing technical difficulties.</p>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCardsData.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-3">
          <PerformanceChart />
        </div>
        
        {/* Conversions Chart */}
        <div className="lg:col-span-1">
          <ConversionsChart />
        </div>

        {/* Sessions by Country */}
        <div className="lg:col-span-1">
          <SessionsByCountry />
        </div>
        
        {/* Top Pages Table */}
        <div className="lg:col-span-1">
          <TopPagesTable />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;