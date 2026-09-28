import { Router } from 'express';
import { createEventController, getEventsController } from '../controllers/event.controller';

const router = Router();

router.post('/', createEventController);
router.get('/', getEventsController);

export default router;
