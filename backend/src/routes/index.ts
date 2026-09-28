import { Router } from 'express';
import healthRoutes from './health.routes';

const router = Router();

// Health check route mounted under /api/health as well
router.use('/health', healthRoutes);

// Base /api router structure
// Future assessment routes can be added here, for example:
// router.use('/events', eventsRoutes);

export default router;
