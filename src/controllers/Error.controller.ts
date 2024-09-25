import { NextFunction, Request, Response } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
   err.statusCode = err.statusCode || 500;
   err.status = err.status || 'fail';

   res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
   });
};
