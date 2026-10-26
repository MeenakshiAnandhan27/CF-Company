import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.ts';
import categoryRoutes from './routes/categories.ts';
import productRoutes from './routes/products.ts';
import enquiryRoutes from './routes/enquiries.ts';
import { initDb, getActiveDbType } from './db/index.ts';
import { seedDatabase } from './db/seed.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and parser middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Classic Fashions API',
    database: getActiveDbType(),
    timestamp: new Date().toISOString(),
  });
});

// Bind API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/enquiries', enquiryRoutes);

// 404 handler for unknown API endpoints
app.use('/api/*', (_req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start Server and initialize DB
async function startServer() {
  try {
    console.log('🚀 Initializing Classic Fashions Backend...');
    await initDb();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`✨ Server running on http://localhost:${PORT}`);
      console.log(`📡 Health endpoint: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

export default app;
