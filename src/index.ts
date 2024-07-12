import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import appRouter from './routes/index';
import db from './configs/database.config';

//Connect to db
db.connect();
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(`${__dirname}/assets`));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('', appRouter);


app.listen(port, () => {
  return console.log(`Server is listening at http://localhost:${port}`);
});

export default app;
