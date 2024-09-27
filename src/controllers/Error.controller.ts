import { NextFunction, Request, Response } from 'express';
import logger from '../logger/winston';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
   err.statusCode = err.statusCode || 500;
   err.status = err.status || 'Fail';
   res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
   });
};
