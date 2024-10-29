import { NextFunction, Request, Response } from 'express';
import Tour from '../model/Tour.model';
import logger from '../logger/winston';
import APIFeature from '../utils/apiFeature';
import AppError from '../utils/appError';

export const aliasTopTours = (req: Request, res: Response, next: NextFunction) => {
   req.query.limit = '5';
   req.query.sort = '-ratingsAverage,price';
   req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
   next();
};

export const getAllTour = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const feature = new APIFeature(Tour.find(), req.query)
         .filter()
         .sort()
         .limitFields()
         .paginate();

      const tours = await feature.query;
      res.status(200).json({
         message: 'Get all tours successfully!',
         total: tours.length,
         data: tours,
      });
   } catch (error) {
      logger.error(`Get all tours error: ${error}`);
      next(error);
   }
};

export const getTourbyId = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const tour = await Tour.findById(req.params.id).populate({
         path: 'guides',
         select: '-passWordChangeAt'
      });
      if (!tour) {
         return next(new AppError('No tour found with that ID', 404));
      }
      res.status(200).json({
         message: 'Get tour by id successfully!',
         data: tour,
      });
   } catch (error) {
      logger.error(`Get tour by id error: ${error}`);
      next(error);
   }
};

export const createTour = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const newTour = await Tour.create(req.body);
      res.status(201).json({
         message: 'Create a new tour successfully!',
         data: newTour,
      });
   } catch (error: any) {
      logger.error(`Create tour error: ${error}`);
      next(error);
   }
};

export const updateTour = async (req: Request, res: Response, next: NextFunction) => {
   try {
      if (Object.keys(req.body).length === 0) {
         return next(new AppError('Tour to update can not be empty!', 400));
      }
      const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true,
      });
      if (!tour) {
         return next(new AppError('Tour not found', 404));
      }
      res.status(200).json({
         message: 'Update tour successfully!',
         data: tour,
      });
   } catch (error) {
      logger.error(`Update tour error: ${error}`);
      next(error);
   }
};

export const deleteTour = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { id } = req.params;
      const result = await Tour.findByIdAndDelete(id);
      if (!result) {
         return next(new AppError('No document found with that ID', 404));
      }
      res.status(200).json({
         messgage: `Delete tour id: ${id} successfully!`,
      });
   } catch (error) {
      logger.error(`Delete tour error: ${error}`);
      next(error);
   }
};

export const getTourStast = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const stast = await Tour.aggregate([
         {
            $match: { ratingsAverage: { $gte: 4.5 } },
         },
         {
            $group: {
               _id: { $toUpper: '$difficulty' },
               numTours: { $sum: 1 },
               numRatings: { $sum: '$ratingsQuantity' },
               avgRating: { $avg: '$ratingsAverage' },
               avgPrice: { $avg: '$price' },
               minPrice: { $min: '$price' },
               maxPrice: { $max: '$price' },
            },
         },
         {
            $sort: { avgPrice: 1 },
         },
      ]);
      res.status(200).json({
         message: 'Get tour stast successfully!',
         data: stast,
      });
   } catch (error) {
      logger.error(`Get tour stats error: ${error}`);
      next(error);
   }
};

export const getMonthlyPlan = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const year = (req.params.year as any) * 1;
      const plan = await Tour.aggregate([
         {
            $unwind: '$startDates',
         },
         {
            $match: {
               $expr: {
                  $and: [
                     { $gte: [{ $toDate: '$startDates' }, new Date(`${year}-01-01`)] },
                     { $lte: [{ $toDate: '$startDates' }, new Date(`${year}-12-31`)] },
                  ],
               },
            },
         },
         {
            $group: {
               _id: { $month: { $toDate: '$startDates' } },
               numTourStarts: { $sum: 1 },
               tours: { $push: '$name' },
            },
         },
         {
            $addFields: { month: '$_id' },
         },
         {
            $project: { _id: 0 },
         },
         {
            $sort: { numTourStarts: -1 },
         },
         {
            $limit: 12,
         },
      ]);
      res.status(200).json({
         message: 'Get monthly plan successfully!',
         total: plan.length,
         data: plan,
      });
   } catch (error) {
      logger.error(`Get Monthly plan error: ${error}`);
      next(error);
   }
};
