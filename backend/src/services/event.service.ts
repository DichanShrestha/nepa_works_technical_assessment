import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { EventInput, GetEventsQuery } from '../schema/event.schema';
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

export async function getEventsService(query: GetEventsQuery) {
  try {
    const { page, limit, event_type, start_date, end_date } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.EventWhereInput = {};

    if (event_type) {
      where.eventType = event_type;
    }

    if (start_date || end_date) {
      where.timestamp = {};
      if (start_date) where.timestamp.gte = start_date;
      if (end_date) where.timestamp.lte = end_date;
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
      }),
      prisma.event.count({ where }),
    ]);

    return {
      events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw AppError.internal();
  }
}

export async function getEventAnalyticsService() {
  try {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [countsPerType, totalCount] = await Promise.all([
      prisma.event.groupBy({
        by: ['eventType'],
        _count: { eventType: true },
        where: {
          timestamp: { gte: last24Hours },
        },
        orderBy: { _count: { eventType: 'desc' } },
      }),
      prisma.event.count({
        where: {
          timestamp: { gte: last24Hours },
        },
      }),
    ]);

    return {
      totalEvents: totalCount,
      eventCountsByType: countsPerType.map((item) => ({
        eventType: item.eventType,
        count: item._count.eventType,
      })),
      timeWindow: {
        start: last24Hours,
        end: now,
      },
    };
  } catch (error) {
    throw AppError.internal();
  }
}
