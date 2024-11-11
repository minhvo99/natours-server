import { NextFunction, Request, Response } from 'express';
import Tour from '../model/Tour.model';
import logger from '../logger/winston';
import { deleteOne, updateOne, createOne, getOne, getAll } from './HandleFactory';
import AppError from '../utils/appError';
import { earthRadiusIsKm, earthRadiusIsMi } from '../constans/constant';
import multer, { FileFilterCallback } from 'multer';
import sharp from 'sharp';

const multerStorage = multer.memoryStorage();

const multerFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
   if (file.mimetype.startsWith('image')) {
      cb(null, true);
   } else {
      cb(new AppError('Not an image! Please upload only imaged.', 400));
   }
};

const upload = multer({
   storage: multerStorage,
   fileFilter: multerFilter,
});

export const uploadTourImage = upload.fields([
   { name: 'imageCover', maxCount: 1 },
   { name: 'images', maxCount: 3 },
]);

export const reSizeTourImages = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const files = req.files as {
         imageCover?: Express.Multer.File[];
         images?: Express.Multer.File[];
      };
      if (!files.imageCover || !files.images) return next();
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      req.body.imageCover = `tour-${req.params.id}-${uniqueSuffix}-cover.jpeg`;
      await sharp((files.imageCover as Express.Multer.File[])[0].buffer)
         .resize(2000, 1333)
         .toFormat('jpeg')
         .jpeg({ quality: 90 })
         .toFile(`publics/imgs/${req.body.imageCover}`);
      next();
   } catch (error) {
      logger.error(`Fail to reSizeTourImage: ${error}`);
      next(error);
   }
};

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

export const getTourWithin = async (req: Request, res: Response, next: NextFunction) => {
   try {
      ///tours-within/:distance/center/:latlng/unit/:unit
      const { distance, latlng, unit } = req.params;
      const [lat, lng] = latlng.split(',');
      if (!lat || !lng) {
         return next(
            new AppError('Please provide latitude and logtitude in the format lat,lng.', 400),
         );
      }
      const radius =
         unit === 'mi' ? Number(distance) / earthRadiusIsMi : Number(distance) / earthRadiusIsKm;
      const tours = await Tour.find({
         startLocation: {
            $geoWithin: {
               $centerSphere: [[lng, lat], radius],
            },
         },
      });
      res.status(200).json({
         message: 'success',
         data: { tours },
      });
   } catch (error) {
      logger.error(`Fail to get tour within: ${error}`);
      next(error);
   }
};

export const getDistances = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { latlng, unit } = req.params;
      const [lat, lng] = latlng.split(',');
      if (!lat || !lng) {
         return next(
            new AppError('Please provide latitude and logtitude in the format lat,lng.', 400),
         );
      }
      // convert meter to miles:
      const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

      const distance = await Tour.aggregate([
         {
            $geoNear: {
               near: {
                  type: 'Point',
                  coordinates: [Number(lng), Number(lat)],
               },
               distanceField: 'distance',
               distanceMultiplier: multiplier,
            },
         },
         {
            $project: {
               distance: 1,
               name: 1,
            },
         },
      ]);
      res.status(200).json({
         message: 'success',
         data: { distance },
      });
   } catch (error) {
      logger.error(`Fail to get distance: ${error}`);
      next(error);
   }
};
