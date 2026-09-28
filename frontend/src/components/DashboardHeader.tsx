import { Activity } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 mb-4 border-b border-gray-200">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">System Events</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time monitoring and analytics for all system activities.</p>
      </div>
      <div className="mt-4 sm:mt-0 flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-md">
        <Activity className="w-4 h-4 text-green-600" />
        <span className="text-xs font-medium text-green-700 uppercase tracking-wider">Live Connection</span>
      </div>
    </div>
  );
}
