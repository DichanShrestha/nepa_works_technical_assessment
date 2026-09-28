import { Response, Request } from 'express';
import { createEventSchema } from '../schema/event.schema';
import { sendErrorResponse, sendResponse } from '../utils/response';
import { createEventService } from '../services/event.service';

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
