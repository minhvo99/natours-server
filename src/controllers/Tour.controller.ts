import { NextFunction, Request, Response } from 'express';
import Tour from '../model/Tour.model';
import logger from '../logger/winston';
import mongoose from 'mongoose';

class TourController {
   async getAllTour(req: Request, res: Response, next: NextFunction) {
      try {
         const tours = await Tour.find();
         res.status(200).json({
            message: 'Get all tour is successfuly!',
            total: tours.length,
            data: tours,
         });
      } catch (error) {
         logger.error(`Get all tour error: ${error}`);
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

export default new TourController();
