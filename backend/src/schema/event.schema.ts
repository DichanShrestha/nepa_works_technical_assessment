import { z } from 'zod';

export const createEventSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  eventType: z.string().min(1),
  payload: z.record(z.string(), z.unknown()),
  timestamp: z.coerce.date(),
});

export type EventInput = z.infer<typeof createEventSchema>;

export const getEventsQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  event_type: z.string().optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
});

export type GetEventsQuery = z.infer<typeof getEventsQuerySchema>;
