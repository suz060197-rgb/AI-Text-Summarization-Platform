import cors from 'cors';
import express from 'express';
import authRoutes from '../routes/auth.routes.js';
import summarizeRoutes from '../routes/summarize.routes.js';
import { errorHandler } from '../utils/errorHandler.js';
import { logger } from '../utils/logger.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
  app.use(express.json({ limit: '2mb' }));
  app.use(logger);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'AI Text Summarization Platform' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/summarize', summarizeRoutes);
  app.use(errorHandler);

  return app;
}
