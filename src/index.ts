import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import urlRoutes from './routes/url';
import qrCodeRoutes from './routes/qrCode';
import analyticsRoutes from './routes/analytics';
import authRoutes from './routes/auth';
import rateLimiters from './middlewares/rateLimiter';

require('events').EventEmitter.defaultMaxListeners = 15;


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.json());

app.use(rateLimiters);

app.use('api/url', urlRoutes);
app.use('api/qr', qrCodeRoutes);
app.use('api/analytics', analyticsRoutes)
app.use('api/auth', authRoutes);


const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to MongoDB')
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT} `)
        })
    } catch (error) {
        console.error('Error connecting to MongoDB', error)
        process.exit(1);
    }
}


startServer();