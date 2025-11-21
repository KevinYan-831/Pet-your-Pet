const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import middleware
const { logger } = require('./middleware/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routers/auth');
const petsRoutes = require('./routers/pets');

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(logger); // Request logging

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend server is running!',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Pet Your Pet Backend API',
    version: '2.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      pets: '/api/pets'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petsRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🔒 Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`🐾 Pets endpoints: http://localhost:${PORT}/api/pets`);
});
