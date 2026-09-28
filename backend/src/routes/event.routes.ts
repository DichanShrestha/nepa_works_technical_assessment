import { Router } from 'express';
import { createEventController } from '../controllers/event.controller';

const router = Router();

router.get('/', createEventController);

export default router;
