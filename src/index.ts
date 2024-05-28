import express, { NextFunction, Request, Response } from 'express';
import AppError from './services/AppError';
import routes from './routes/departure';
import {swaggerUi,specs} from './services/swagger';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use('/', routes);

app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(specs))

app.get('/', (req, res) => {
  res.send('Junior Backend Coding Challenge');
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError('Page Not Found', 404);
  next(error);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const status = (err as AppError).status || 500;

  const message = err.message || 'Something went wrong';

  res.status(status).json({
    status,
    message,
  });
});

app.listen(3000, () => {
  console.log(`App Listening on port ${port}`);
});
