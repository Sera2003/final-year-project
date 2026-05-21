import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import recommendationRouter from './routes/recommendationRoute.js';
import newsletterRouter from './routes/newsletterRoute.js';
import { logAccess } from './middleware/logAccess.js';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from "cookie-parser";
import errorHandler from './middleware/errorHandler.js';
import tryonRouter from "./routes/tryonRoute.js";
import reviewRouter from './routes/reviewRoute.js';
import dashboardRouter from './routes/dashboardRoute.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

connectCloudinary(); // Connect to Cloudinary
connectDB(); // Connect to MongoDB

app.use(express.json());

app.use(cors({
  origin: true, // your frontend dev server
  credentials: true
}));

app.use(logAccess);
app.use((req, res, next) => {
  if (req.body) {
    mongoSanitize.sanitize(req.body);
  }
  if (req.params) {
    mongoSanitize.sanitize(req.params);
  }
  if (req.query) {
    mongoSanitize.sanitize(req.query);
  }
  next();
});

app.use(cookieParser());

// Serve static products folder
app.use('/products', express.static(path.join(__dirname, 'bin/products')));

// Serve static user files (profile pictures, etc.)
app.use('/users', express.static(path.join(__dirname, 'bin/users')));

// Serve public static files for test pages
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/recommendation', recommendationRouter);
app.use('/api/newsletter', newsletterRouter);
app.use("/api", tryonRouter);
app.use('/api/review', reviewRouter);
app.use('/api/dashboard', dashboardRouter);
app.get('/', (req, res) => {
  res.send("API Working");
});

app.use(errorHandler);


const shouldUseHttps = process.env.FORCE_HTTPS === 'true';

if (!shouldUseHttps) {
  app.listen(port, '0.0.0.0', () => {
    console.log("HTTP Server running on http://0.0.0.0:" + port);
  });
} else {
  const httpsOptions = {
    key: fs.readFileSync('localhost+1-key.pem'),
    cert: fs.readFileSync('localhost+1.pem'),
  };

  https.createServer(httpsOptions, app).listen(port, () => {
    console.log("HTTPS Server running on https://localhost:" + port);
  });
}
