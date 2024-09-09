import { NextFunction, Request, Response } from 'express';
import Tour from '../model/Tour.model';
import logger from '../logger/winston';
import mongoose from 'mongoose';

export default class TourController {

   async aliasTopTours(req: Request, res: Response, next: NextFunction) {

   }
   async getAllTour(req: Request, res: Response, next: NextFunction) {
      try {
         const queryObj = { ...req.query };
         const excludedFields = ['page', 'sort', 'limit', 'fields'];
         excludedFields.forEach((field) => delete queryObj[field]);

         let queryStr = JSON.stringify(queryObj);
         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

         let query = Tour.find(JSON.parse(queryStr));
         // sort function
         if (typeof req.query?.sort === 'string' && req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
         } else {
            query = query.sort('-createdAt');
         }
         // fields limit function
         if (typeof req.query?.fields === 'string' && req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
         } else {
            query = query.select('-__v');
         }

         // pagination function
         const limit = (req.query.limit as any) * 1 || 100;
         const page = (req.query.page as any) * 1 || 1;
         const skip = (page - 1) * limit;
         query = query.skip(skip).limit(limit);
         if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) throw new Error('This page does not exits!')
            
         }

         const tours = await query;
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
   }


   async getTourbyId(req: Request, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;
         if (!mongoose.Types.ObjectId.isValid(id)) {
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
   }

   async createTour(req: Request, res: Response, next: NextFunction) {
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
   }

   async updateTour(req: Request, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;
         if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
               message: 'Tour to update can not be empty!',
            });
         }
         if (!mongoose.Types.ObjectId.isValid(id)) {
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
   }

   async deleteTour(req: Request, res: Response, next: NextFunction) {
      try {
         const { id } = req.params;
         if (!mongoose.Types.ObjectId.isValid(id)) {
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
   }
}