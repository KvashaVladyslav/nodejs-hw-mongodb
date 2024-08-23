import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import router from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/constants.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

export default async function setupServer() {
  const app = express();

  app.use('/api-docs', swaggerDocs());

  app.use(cors());
  app.use(cookieParser());
  app.use(pino());
  app.use(router);
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use(notFoundHandler);
  app.use(errorHandler);

  try {
    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}
