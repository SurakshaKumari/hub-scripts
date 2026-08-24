require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('./routes/authRoutes');
const scriptRoutes = require('./routes/scriptRoutes');
const commentRoutes = require('./routes/commentRoutes');
const voteRoutes = require('./routes/voteRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const executorRoutes = require('./routes/executorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
const allowedOrigins = [
  'http://localhost:3000',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(o => o.trim()) : []),
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scripts', scriptRoutes);
app.use('/api/scripts/:scriptId/comments', commentRoutes);
app.use('/api/scripts/:scriptId/vote', voteRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/executors', executorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', project: 'PROBESTHUB' }));

// Database Connection & Server Start
const PORT = process.env.PORT || 4000;

// Export the Express API for Vercel Serverless functions
module.exports = app;

// Only start the server locally if not in a serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 PROBESTHUB Server running on port ${PORT}`);
  });
}
