import express, { type Express, type Request, type Response } from 'express';
import { AppDataSource } from './config/data-source.js';
import { DocumentRepository } from './config/repositorys.js';
import AuthRouter from './controllers/auth.controller.js';
import DocumentRouter from './controllers/document.controller.js';
import cors from 'cors';

import { requestDataMiddleware } from './middlewares/request-data.middleware.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';

const app: Express = express();

const port = 3000;
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected.');
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });
app.use(cors());
app.use(requestDataMiddleware);
app.use(express.json());
app.get('/', async (req: Request, res: Response) => {

  const document = await DocumentRepository
    .findOne({
      where: {
        name: 'Test Document',
      },
    });

  console.log('Document:', document);
  res.send('Hello World!');
});

app.use('/auth', AuthRouter);
app.use('/docs', DocumentRouter);


app.use(errorHandler);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});