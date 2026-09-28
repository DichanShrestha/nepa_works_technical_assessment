import { PaginatedEvents, AnalyticsData } from '../types/event';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const fetchEvents = async (
  page = 1,
  limit = 5,
  filterType?: string,
  searchQuery?: string,
  startDate?: string,
  endDate?: string
): Promise<PaginatedEvents> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  if (filterType && filterType !== 'all') {
    params.append('event_type', filterType);
  }
  if (startDate) {
    params.append('start_date', startDate);
  }
  if (endDate) {
    params.append('end_date', endDate);
  }

  if (searchQuery) {
    params.append('search', searchQuery);
  }

  const res = await fetch(`${API_URL}/api/events?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch events');
  }

  const data = await res.json();
  return data.data;
};

export const fetchAnalytics = async (): Promise<AnalyticsData> => {
  const res = await fetch(`${API_URL}/api/events/analytics`);
  if (!res.ok) {
    throw new Error('Failed to fetch analytics');
  }

  const data = await res.json();
  const analyticsData = data.data;

  const topType = analyticsData.eventCountsByType && analyticsData.eventCountsByType.length > 0
    ? analyticsData.eventCountsByType[0]
    : { eventType: '-', count: 0 };

  const eventsPerMinute = Math.round(analyticsData.totalEvents / (24 * 60));

  return {
    totalEvents: analyticsData.totalEvents,
    topEventType: { type: topType.eventType, count: topType.count },
    mostActiveUser: { userId: 'N/A', count: 0 },
    eventsPerMinute,
  };
};
