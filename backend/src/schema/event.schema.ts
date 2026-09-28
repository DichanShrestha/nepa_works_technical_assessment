import { z } from 'zod';

export const createEventSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  eventType: z.string().min(1),
  payload: z.record(z.string(), z.unknown()),
  timestamp: z.coerce.date(),
});

export type EventInput = z.infer<typeof createEventSchema>;
