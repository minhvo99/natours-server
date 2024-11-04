import { NextFunction, Request, Response } from 'express';
import Tour from '../model/Tour.model';
import logger from '../logger/winston';
import { deleteOne, updateOne, createOne, getOne, getAll } from './HandleFactory';

export const aliasTopTours = (req: Request, res: Response, next: NextFunction) => {
   req.query.limit = '5';
   req.query.sort = '-ratingsAverage,price';
   req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
   next();
};

export const getAllTour = getAll(Tour, 'Get all tour');

export const getTourbyId = getOne(Tour, 'Tour', 'reviews');

export const createTour = createOne(Tour, 'Tour');

export const updateTour = updateOne(Tour, 'Tour');

export const deleteTour = deleteOne(Tour, 'Delete tour');

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
