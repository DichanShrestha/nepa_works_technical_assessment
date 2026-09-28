import { Search, Filter, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
  currentFilter: string;
  onFilterChange: (type: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
}

export default function EventFilters({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange
}: Props) {
  const eventTypes = ['all', 'login', 'logout', 'purchase', 'signup', 'error'];

  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
      <div className="flex-1 relative min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search payload or user ID..."
          className="w-full pl-9 pr-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={currentFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="pl-9 pr-8 py-2 text-sm text-gray-900 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all capitalize min-w-[140px] cursor-pointer"
          >
            {eventTypes.map(type => (
              <option key={type} value={type}>{type === 'all' ? 'All Events' : type}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all cursor-pointer"
            />
          </div>
          <span className="text-gray-500 text-sm font-medium">to</span>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
