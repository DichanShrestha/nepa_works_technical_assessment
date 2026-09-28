export type EventType = 'login' | 'logout' | 'purchase' | 'signup' | 'error';

export interface EventPayload {
  [key: string]: string | number | boolean | null | undefined;
}

export interface AppEvent {
  id: string;
  userId: string;
  eventType: EventType;
  payload: EventPayload;
  timestamp: string;
}

export interface PaginatedEvents {
  events: AppEvent[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AnalyticsData {
  totalEvents: number;
  topEventType: { type: string; count: number };
  mostActiveUser: { userId: string; count: number };
  eventsPerMinute: number;
}
