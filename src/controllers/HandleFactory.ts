import { Model, Document } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import logger from '../logger/winston';
import AppError from '../utils/appError';

export const deleteOne =
   <T extends Document>(model: Model<T>, action: string) =>
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const { id } = req.params;
         const result = await model.findByIdAndDelete(id);
         if (!result) {
            return next(new AppError('No document found with that ID', 404));
         }
         res.status(204).json({
            messgage: `${action} id: ${id} successfully!`,
            data: null,
         });
      } catch (error) {
         logger.error(`${action} error: ${error}`);
         next(error);
      }
   };
