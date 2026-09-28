import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import routes from './routes';
import healthRoutes from './routes/health.routes';
import { notFoundHandler } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const app: Express = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Request logging
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing
app.use(cookieParser());

// Direct GET /health endpoint
app.use('/health', healthRoutes);

// Base /api router structure
app.use('/api', routes);

// 404 Handler for unknown routes
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

export default app;
