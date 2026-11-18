import express, { type Express, type Request, type Response } from 'express';
import { AppDataSource } from './config/data-source.js';
import AuthRouter from './controllers/auth.controller.js';
import DocumentRouter from './controllers/document.controller.js';
import cors from 'cors';

import { requestDataMiddleware } from './middlewares/request-data.middleware.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import { startWebSocketServer } from './surveys/ws-test.js';

async function startServer() {
  try {
    const app: Express = express();
    const port = 3000;

    await AppDataSource.initialize();
    console.log('Database connected.');

    app.use(cors());
    app.use(requestDataMiddleware);
    app.use(express.json());
    app.get('/', async (req: Request, res: Response) => {
      res.send('Hello World!');
    });

    app.use('/auth', AuthRouter);
    app.use('/docs', DocumentRouter);


    app.use(errorHandler);
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });

    startWebSocketServer();

  } catch (error) {
    console.error('Database connection failed:', error);
    process.exitCode = 1;
  }
}

void startServer();