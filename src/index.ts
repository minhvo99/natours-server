import cors from 'cors';
import morgan from 'morgan';
import appRouter from './routes/index';
import db from './configs/database.config';
import express, { Request, Response, NextFunction } from 'express';
import AppError from './utils/appError';
import { errorHandler } from './controllers/Error.controller';
import logger from './logger/winston';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { config } from 'dotenv';

// Load environment variables
config();

// Initialize Express
const app = express();

// Security headers
app.use(helmet());

// CORS - adjust this for production
app.use(
   cors({
      // Change this to your frontend domain in production
      origin: process.env.FRONTEND_URL || 'http://localhost:4200',
      credentials: true,
   }),
);

// Rate limiting
const limiter = rateLimit({
   max: 100,
   windowMs: 60 * 60 * 1000, // 1 hour
   standardHeaders: 'draft-7',
   legacyHeaders: false,
   message: 'Too many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Development logger
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));

// Data sanitization
app.use(mongoSanitize());

// Static files
app.use(express.static(`${__dirname}/assets`));

// Connect to database
db.connect().catch((err) => {
   logger.error(`Database connection error: ${err}`);
   console.error('Failed to connect to database:', err);
});

// API routes
app.use('/api/v1', appRouter);

// Handle unknown routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
   logger.error(`Can't find ${req.originalUrl} on this server`);
   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(errorHandler);

// For local development and testing, remove this for Vercel deployment:
if (process.env.NODE_ENV !== 'production') {
   const port = process.env.PORT || 8080;
   app.listen(port, () => {
      console.log(`Server is listening at http://localhost:${port}`);
   });
}

export default app;
