import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import companyRoutes from './routes/companyRoutes';
import serviceRoutes from './routes/serviceRoutes';
import faqRoutes from './routes/faqRoutes';
import emailTemplateRoutes from './routes/emailTemplateRoutes';
import notificationTemplateRoutes from './routes/notificationTemplateRoutes';
import projectRoutes from './routes/projectRoutes';
import blogRoutes from './routes/blogRoutes';
import jobRoutes from './routes/jobRoutes';
import tutorialRoutes from './routes/tutorialRoutes';
import positionRoutes from './routes/positionRoutes';
import emailRoutes from './routes/emailRoutes';

dotenv.config();

const app: Application = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
const allowedOrigins = [
  'http://localhost:3002',
  'http://127.0.0.1:3002',
  'https://kennytechstudios.com',
  'https://www.kennytechstudios.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request Logger with Time
app.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = new Date().toISOString();
  console.log(`[${startTime}] ${req.method} ${req.originalUrl} - Request Received`);

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} [${res.statusCode}] - ${duration}ms`);
  });
  next();
});

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Kenny Tech API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/email-templates', emailTemplateRoutes);
app.use('/api/notification-templates', notificationTemplateRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/tutorials', tutorialRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/emails', emailRoutes);

// Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'Error',
    message: err.message || 'Internal Server Error',
  });
});

export default app;
