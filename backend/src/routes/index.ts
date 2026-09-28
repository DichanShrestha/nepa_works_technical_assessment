import { Router } from 'express';
import healthRoutes from './health.routes';
import eventsRoutes from './event.routes';

const router = Router();

router.use('/health', healthRoutes);

router.use('/events', eventsRoutes);

export default router;
