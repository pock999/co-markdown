import express, { type Express, type Request, type Response } from 'express';
import { AppDataSource } from './config/data-source.js';
import { DocumentRepository } from './config/repositorys.js';

const app: Express = express();
const port = 3000;
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected.');
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});