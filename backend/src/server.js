import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import tenderRoutes from './routes/tenderRoutes.js';
import bidRoutes from './routes/bidRoutes.js';
import auditRoutes from './routes/auditRoutes.js';

const app = express();

// --- CORS ---
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5173', 'http://localhost:4173'];

app.use(cors({
    origin: (origin, cb) => {
        // allow server-to-server (no origin) or whitelisted origins
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

// --- Body parsing with size limit ---
app.use(express.json({ limit: '1mb' }));

// --- Health check ---
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Routes ---
app.use('/auth', authRoutes);
app.use('/tenders', tenderRoutes);
app.use('/bids', bidRoutes);
app.use('/audit', auditRoutes);

// --- Global error handler (no stack traces in production) ---
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});