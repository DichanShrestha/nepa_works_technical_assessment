import { Router } from 'express';
import { createEventController, getEventsController, getEventAnalyticsController } from '../controllers/event.controller';

const router = Router();

router.post('/', createEventController);
router.get('/analytics', getEventAnalyticsController);
router.get('/', getEventsController);

export default router;
