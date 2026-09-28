import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { EventInput } from '../schema/event.schema';
import { AppError } from '../utils/AppError';

export async function createEventService(data: EventInput) {
  try {
    const { eventType, payload, timestamp, userId } = data;
    const event = await prisma.event.create({
      data: {
        eventType,
        payload: payload as Prisma.InputJsonObject,
        timestamp,
        userId,
      },
    });

    return event;
  } catch (error) {
    throw AppError.internal();
  }
}
