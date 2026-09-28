import { AnalyticsData } from '../types/event';
import { BarChart3, Users, Zap, TrendingUp } from 'lucide-react';

interface Props {
  data: AnalyticsData | null;
  isLoading: boolean;
}

export default function AnalyticsCards({ data, isLoading }: Props) {
  const cards = [
    {
      title: 'Total Events (24h)',
      value: data?.totalEvents.toLocaleString() || '0',
      icon: <BarChart3 className="w-5 h-5 text-gray-500" />,
      description: '+12% from yesterday',
    },
    {
      title: 'Top Event Type',
      value: data?.topEventType.type || '-',
      icon: <TrendingUp className="w-5 h-5 text-gray-500" />,
      description: `${data?.topEventType.count.toLocaleString() || 0} occurrences`,
      capitalize: true,
    },
    {
      title: 'Most Active User',
      value: data?.mostActiveUser.userId || '-',
      icon: <Users className="w-5 h-5 text-gray-500" />,
      description: `${data?.mostActiveUser.count.toLocaleString() || 0} events`,
    },
    {
      title: 'Throughput',
      value: `${data?.eventsPerMinute || 0} /min`,
      icon: <Zap className="w-5 h-5 text-gray-500" />,
      description: 'Stable performance',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
            {card.icon}
          </div>
          {isLoading ? (
            <div className="h-8 bg-gray-100 rounded animate-pulse w-1/2 mt-1 mb-2"></div>
          ) : (
            <p className={`text-2xl font-semibold text-gray-900 ${card.capitalize ? 'capitalize' : ''}`}>
              {card.value}
            </p>
          )}
          {isLoading ? (
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3"></div>
          ) : (
            <p className="text-xs text-gray-400 mt-1">{card.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
