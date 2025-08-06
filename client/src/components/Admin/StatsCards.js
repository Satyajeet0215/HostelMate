import React from 'react';
import { AlertCircle, Clock, CheckCircle, TrendingUp } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Complaints',
      value: stats.total,
      icon: AlertCircle,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      iconColor: 'text-blue-200',
      textColor: 'text-blue-100'
    },
    {
      title: 'Open Complaints',
      value: stats.open,
      icon: AlertCircle,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      iconColor: 'text-red-200',
      textColor: 'text-red-100'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      iconColor: 'text-yellow-200',
      textColor: 'text-yellow-100'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      iconColor: 'text-green-200',
      textColor: 'text-green-100'
    }
  ];

  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className={`card ${card.color} text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={card.textColor}>{card.title}</p>
                <p className="text-3xl font-bold">{card.value}</p>
                
                {/* Show additional info for total complaints */}
                {index === 0 && (
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">{resolutionRate}% resolved</span>
                  </div>
                )}
              </div>
              <Icon className={`h-12 w-12 ${card.iconColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;