import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import appRouter from './routes/index';
import db from './configs/database.config';
import { NextFunction, Request, Response } from 'express';
import AppError from './utils/appError';
import { errorHandler } from './controllers/Error.controller';
import logger from './logger/winston';

//Connect to db
db.connect();
const app = express();
const port = process.env.PORT || 8080;
app.use(express.static(`${__dirname}/assets`));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api/v1', appRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
   logger.error(`Can't find ${req.originalUrl} on this server`);
   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

const server = app.listen(port, () => {
   return console.log(`Server is listening at http://localhost:${port}`);
});

process.on('unhandledRejection', (err: any) => {
   console.log('UNHANDLED Rejection! 💣 Shutting down...');
   console.log(err.name, err.message);
   server.close(() => {
      process.exit(1);
   });
});

process.on('uncaughtException', (err: any) => {
   console.log('UNCAUGHT Exception! 💣 Shutting down...');
   console.log(err.name, err.message);
   server.close(() => {
      process.exit(1);
   });
});

export default app;
