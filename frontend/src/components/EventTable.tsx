import { AppEvent } from '../types/event';
import { format } from 'date-fns';

interface Props {
  events: AppEvent[];
  isLoading: boolean;
}

const getBadgeStyle = (type: string) => {
  switch (type) {
    case 'login': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'logout': return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'purchase': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'signup': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'error': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export default function EventTable({ events, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white">
        <div className="animate-pulse flex flex-col">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border-b border-gray-100">
              <div className="h-4 bg-gray-100 rounded w-24"></div>
              <div className="h-4 bg-gray-100 rounded w-32"></div>
              <div className="h-4 bg-gray-100 rounded flex-1"></div>
              <div className="h-4 bg-gray-100 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="w-full border border-gray-200 rounded-lg bg-white p-12 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900">No events found</h3>
        <p className="text-sm text-gray-500 mt-1">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      {/* Desktop/Tablet View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-medium">
              <th className="px-6 py-4 whitespace-nowrap">Event Type</th>
              <th className="px-6 py-4 whitespace-nowrap">User ID</th>
              <th className="px-6 py-4">Payload</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 text-xs font-medium border rounded-md capitalize ${getBadgeStyle(event.eventType)}`}>
                    {event.eventType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900 font-medium">{event.userId}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <pre className="text-[11px] leading-relaxed text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 overflow-x-auto">
                      {JSON.stringify(event.payload, null, 2)}
                    </pre>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-900">{format(new Date(event.timestamp), 'MMM d, yyyy')}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{format(new Date(event.timestamp), 'HH:mm:ss')}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden divide-y divide-gray-100">
        {events.map((event) => (
          <div key={event.id} className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <span className={`px-2.5 py-1 text-xs font-medium border rounded-md capitalize ${getBadgeStyle(event.eventType)}`}>
                {event.eventType}
              </span>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{format(new Date(event.timestamp), 'MMM d, yyyy')}</div>
                <div className="text-xs text-gray-500">{format(new Date(event.timestamp), 'HH:mm:ss')}</div>
              </div>
            </div>
            
            <div>
              <span className="text-xs text-gray-500 uppercase font-medium">User</span>
              <div className="text-sm text-gray-900 font-medium">{event.userId}</div>
            </div>

            <div>
              <span className="text-xs text-gray-500 uppercase font-medium">Payload</span>
              <pre className="text-[11px] leading-relaxed text-gray-600 bg-gray-50 p-2 mt-1 rounded border border-gray-100 overflow-x-auto">
                {JSON.stringify(event.payload, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
