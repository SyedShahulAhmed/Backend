import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser'
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Common middlewares
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieparser())

// Import routes
import healthCheckRouter from './routes/HealthCheck.routes.js';
import userRouter from './routes/User.routes.js'
import { errorhandler } from './middlewares/error.middlewares.js';

// Use routes
app.use('/api/v1/healthCheck', healthCheckRouter);
app.use('/api/v1/users', userRouter);
// app.use(errorhandler)
export { app };
