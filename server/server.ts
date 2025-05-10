import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.ts';
import bookingRoutes from './routes/bookingRoutes.ts';
import locationRoutes from './routes/locationRoutes.ts';
import loginRoutes from './routes/loginRoutes.ts';
import cors from 'cors';
// import validateTelegramData from './telegram-auth/validateTelegramData.ts';
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 3000;


// Middleware to parse JSON (useful for APIs)
app.use(express.json());

// Шлях до згенерованих файлів фронтенду (залежить від того, як ви налаштували Vite)
const buildPath = path.join(__dirname, '..', 'dist');  // Зазвичай для Vite це dist

/// Обслуговуємо статичні файли з префіксом '/scheduler'
app.use('/scheduler', express.static(buildPath));

// Для всіх інших запитів (якщо це не API) відправляємо index.html
app.get('/scheduler/*', (_:Request, res:Response) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});


const corsOptions = {
  origin: ['https://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


if (process.env.NODE_ENV === 'development') {
    // Локальний HTTPS-сервер
    const httpsOptions = {
        key: fs.readFileSync('cert/localhost-key.pem'),
        cert: fs.readFileSync('cert/localhost.pem'),
    };

    mongoose
        .connect(process.env.MONGO_URI as string)
        .then(() => {
            console.log('Connected to MongoDB');
            https.createServer(httpsOptions, app).listen(PORT, () => {
                console.log(`🚀 HTTPS Server running at https://localhost:${PORT}`);
            });
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
        });
} else {
    // Продакшен-сервер на HTTP (Render сам забезпечує HTTPS)
    mongoose
        .connect(process.env.MONGO_URI as string)
        .then(() => {
            console.log('Connected to MongoDB');
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
        }); 
}

// Default Route
app.get('/', (_: Request, res: Response) => {
  res.send('API is running...');
});

app.get('/api/hello', (_ :Request, res:Response) => {
  res.json({ message: 'Hello from Express!' });
});

// User route
app.use('/api/users', userRoutes);

// Booking route
app.use('/api/bookings', bookingRoutes);

// Locations route
app.use('/api/locations', locationRoutes);

// Login route
app.use('/api/login', loginRoutes);

/// TELEGRAM ///

// app.get('/login', (req: any, res: any) => {
//   console.log('Received query:', req.query); // Повні дані від Telegram
//   if (validateTelegramData(req.query as any)) {
//     const { first_name, last_name, username } = req.query as any;
//     console.log('Validated user:', { first_name, last_name, username });
//     res.json({
//       message: `Вітаємо, ${first_name} ${last_name || ''} (@${username || 'немає'})!`,
//       user: { first_name, last_name, username },
//     });
//   } else {
//     console.log('Validation failed for:', req.query);
//     res.status(401).json({ error: 'Помилка авторизації' });
//   }
// });
