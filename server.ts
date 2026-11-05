import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './server/routes/auth.ts';
import categoryRoutes from './server/routes/categories.ts';
import productRoutes from './server/routes/products.ts';
import enquiryRoutes from './server/routes/enquiries.ts';
import { initDb, getActiveDbType } from './server/db/index.ts';
import { seedDatabase } from './server/db/seed.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// CORS configuration
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

// Fallback for missing API routes
app.all('/api/*', (_req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global API error handler
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

async function startServer() {
  try {
    console.log('🚀 Initializing Classic Fashions Full-Stack Platform...');
    await initDb();
    await seedDatabase();

    if (!isProd) {
      // In development: Attach Vite dev server middleware
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
          host: '0.0.0.0',
          port: PORT,
          hmr: process.env.DISABLE_HMR !== 'true',
        },
        appType: 'spa',
      });

      app.use(vite.middlewares);

      // Handle SPA HTML serving in dev
      app.use('*', async (req, res, next) => {
        const url = req.originalUrl;
        if (url.startsWith('/api')) {
          return next();
        }
        try {
          const indexPath = path.resolve(__dirname, 'index.html');
          let template = fs.readFileSync(indexPath, 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e: any) {
          vite.ssrFixStacktrace(e);
          next(e);
        }
      });

      console.log('⚡ Vite development middleware active.');
    } else {
      // In production: Serve static build assets
      const distPath = path.resolve(__dirname, 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✨ CLASSIC FASHIONS Full-Stack Server running at http://0.0.0.0:${PORT}`);
      console.log(`📡 Backend health endpoint: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

export default app;
