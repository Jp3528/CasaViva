import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import apiRouter from './routes';

export const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Root route welcome
app.get('/', (req: Request, res: Response) => {
  res.json({
    nombre: 'CasaViva E-commerce API',
    mensaje: 'Bienvenido al servidor de CasaViva. Para consultar productos visita /api/products',
    documentacion: '/api/health'
  });
});

// 404 Handler for API
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.url}`
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error no controlado en el servidor:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
});
