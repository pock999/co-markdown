import express, { type Express, type Request, type Response } from 'express';
import { AppDataSource } from './config/data-source.js';
import { DocumentRepository } from './config/repositorys.js';
import AuthRouter from './controllers/auth.controller.js';
import cors from 'cors';

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});