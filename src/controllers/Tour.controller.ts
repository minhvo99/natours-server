import { NextFunction, Request, Response } from 'express';
import Tour from '../model/Tour.model';
import logger from '../logger/winston';
import APIFeature from '../utils/apiFeature';

export const aliasTopTours = (req: Request, res: Response, next: NextFunction) => {
   req.query.limit = '5';
   req.query.sort = '-ratingsAvarage,price';
   req.query.fields = 'name,price,ratingsAvarage,summary,difficulty';
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
      res.status(500).json({
         status: 'Fail to get tours',
         message: error,
      });
      next(error);
   }
};

export const getTourbyId = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { id } = req.params;
      if (!id) {
         return res.status(400).json({
            message: 'Invalid id',
         });
      }
      const tour = await Tour.findById(id);
      if (!tour) {
         return res.status(404).json({
            status: 'fail',
            message: 'Tour not found',
         });
      }
      res.status(200).json({
         message: 'Get tour by id successfully!',
         data: tour,
      });
   } catch (error) {
      logger.error(`Get tour by id error: ${error}`);
      res.status(500).json({
         status: 'error',
         message: `Fail to get tour: ${error}`,
      });
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
      const { id } = req.params;
      if (Object.keys(req.body).length === 0) {
         return res.status(400).json({
            message: 'Tour to update can not be empty!',
         });
      }
      if (!id) {
         return res.status(400).json({
            message: 'Invalid id',
         });
      }
      const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true,
      });
      if (!tour) {
         return res.status(404).json({
            message: 'fail to update tour',
         });
      }
      res.status(200).json({
         message: 'Update tour successfully!',
         data: tour,
      });
   } catch (error) {
      logger.error(`Update tour error: ${error}`);
      res.status(500).json({
         status: 'error',
         message: `Fail to update tour: ${error}`,
      });
      next(error);
   }
};

export const deleteTour = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { id } = req.params;
      if (!id) {
         return res.status(400).json({
            message: 'Invalid id',
         });
      }
      await Tour.findByIdAndDelete(id);
      res.status(200).json({
         messgage: `Delete tour id: ${id} successfully!`,
      });
   } catch (error) {
      logger.error(`Delete tour error: ${error}`);
      res.status(500).json({
         status: 'error',
         message: `Fail to delete tour: ${error}`,
      });
      next(error);
   }
};

export const getTourStast = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const stast = await Tour.aggregate([
         {
            $match: { ratingsAvarage: { $gte: 4.5 } },
         },
         {
            $group: {
               _id: { $toUpper: '$difficulty' },
               numTours: { $sum: 1 },
               numRatings: { $sum: '$ratingsQuantity' },
               avgRating: { $avg: '$ratingsAvarage' },
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
      res.status(500).json({
         status: 'Fail to get tour stats',
         message: error,
      });
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
      res.status(500).json({
         status: 'Fail to get monthly plan',
         message: error,
      });
      next(error);
   }
};
