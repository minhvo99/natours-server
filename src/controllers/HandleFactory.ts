import { Model, Document } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import logger from '../logger/winston';
import AppError from '../utils/appError';
import APIFeature from '../utils/apiFeature';

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
      } catch (error: unknown) {
         logger.error(`${action} error: ${error}`);
         next(error);
      }
   };

export const updateOne =
   <T extends Document>(model: Model<T>, action: string) =>
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         if (Object.keys(req.body).length === 0) {
            return next(new AppError(`${action} to update can not be empty!`, 400));
         }
         const docs = await model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
         });
         if (!docs) {
            return next(new AppError(`${action} not found`, 404));
         }
         res.status(200).json({
            message: `Update ${action} successfully!`,
            data: {
               tour: docs,
            },
         });
      } catch (error: unknown) {
         logger.error(`Update ${action} error: ${error}`);
         next(error);
      }
   };

export const createOne =
   <T extends Document>(model: Model<T>, action: string) =>
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const newTour = await model.create(req.body);
         res.status(201).json({
            message: `Create a new ${action} successfully!`,
            data: newTour,
         });
      } catch (error: unknown) {
         logger.error(`Create ${action} error: ${error}`);
         next(error);
      }
   };

export const getOne =
   <T extends Document>(model: Model<T>, action: string, queryOption: string) =>
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const query = model.findById(req.params.id);
         if (queryOption) query.populate(queryOption);
         const docs = await query;
         if (!docs) {
            return next(new AppError(`No ${action} found with that ID`, 404));
         }
         res.status(200).json({
            message: `Get ${action} successfully!`,
            data: docs,
         });
      } catch (error) {
         logger.error(`Get ${action} by id error: ${error}`);
         next(error);
      }
   };

export const getAll =
   <T extends Document>(model: Model<T>, action: string) =>
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const feature = new APIFeature(model.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

         const docs = await feature.query;
         res.status(200).json({
            message: `${action} successfully!`,
            total: docs.length,
            data: docs,
         });
      } catch (error) {
         logger.error(`${action} error: ${error}`);
         next(error);
      }
   };
