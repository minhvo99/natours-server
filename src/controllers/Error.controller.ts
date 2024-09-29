import { NextFunction, Request, Response } from 'express';
import logger from '../logger/winston';
import AppError from '../utils/appError';

const sendErrorDev = (err: any, req: Request, res: Response) => {
   return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
   });
};

const sendErrorProd = (err: any, req: Request, res: Response) => {
   if (err.isOperational) {
      return res.status(err.statusCode).json({
         status: err.status,
         message: err.message,
      });
   } else {
      logger.error(err);
      return res.status(500).json({
         status: 'Error',
         message: 'Something went wrong!',
      });
   }
};

const handleCastErrorDB = (err: any) => {
   const message = `Invalid ${err.path}: ${err.value}.`;
   return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
   const message = `Duplicate field value: ${value}. Please use another value!`;
   return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
   console.log(err);
   const errors = Object.values(err.errors).map((el: any) => el.message);

   const message = `Invalid input data. ${errors.join('. ')}`;
   return new AppError(message, 400);
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
   err.statusCode = err.statusCode || 500;
   err.status = err.status || 'Error';

   if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, req, res);
   } else if (process.env.NODE_ENV === 'production') {
      let error = JSON.parse(JSON.stringify(err));
      if (error.name === 'CastError') error = handleCastErrorDB(error);
      if (error.code === 11000) error = handleDuplicateFieldsDB(error);
      if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
      sendErrorProd(error, req, res);
   }
};
