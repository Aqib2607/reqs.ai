import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config';
import routes from './routes';
import globalErrorHandler from './middleware/globalErrorHandler';
import AppError from './utils/AppError';
import { performanceLogger } from './middleware/performance.middleware';

import rateLimit from 'express-rate-limit';

const app = express();

// Global Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Middleware
app.use(performanceLogger);
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import path from 'path';

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../../dist')));

// Valid Routes
app.use('/api/v1', routes);

// Handle React Routing, return all other requests to React app
app.get('*', (req, res, next) => {
    // Skip API routes to allow 404 for them
    if (req.url.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// 404 Handler for API routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
