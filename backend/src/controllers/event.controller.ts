import { Response, Request } from 'express';
import { createEventSchema, getEventsQuerySchema } from '../schema/event.schema';
import { sendErrorResponse, sendResponse } from '../utils/response';
import {
  createEventService,
  getEventsService,
  getEventAnalyticsService,
} from '../services/event.service';

export async function createEventController(req: Request, res: Response) {
  try {
    const body = req.body;

    const result = createEventSchema.safeParse(body);

    if (!result.success) {
      return sendErrorResponse(res, { message: 'Event data is invalid' });
    }

    const event = await createEventService(result.data);

    sendResponse(res, { data: event, message: 'Event created successfully', statusCode: 201 });
  } catch (error) {
    sendErrorResponse(res, { message: 'Internal server error', statusCode: 500 });
  }
}

export async function getEventsController(req: Request, res: Response) {
  try {
    const query = req.query;

    const result = getEventsQuerySchema.safeParse(query);

    if (!result.success) {
      return sendErrorResponse(res, { message: 'Invalid query parameters' });
    }

    const data = await getEventsService(result.data);

    sendResponse(res, { data, message: 'Events retrieved successfully', statusCode: 200 });
  } catch (error) {
    console.log(error);
    sendErrorResponse(res, { message: 'Internal server error', statusCode: 500 });
  }
}

export async function getEventAnalyticsController(req: Request, res: Response) {
  try {
    const data = await getEventAnalyticsService();

    sendResponse(res, { data, message: 'Analytics retrieved successfully', statusCode: 200 });
  } catch (error) {
    sendErrorResponse(res, { message: 'Internal server error', statusCode: 500 });
  }
}
