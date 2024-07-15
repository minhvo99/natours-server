import { NextFunction, Request, Response } from 'express';
import Tour from '../model/Tour.model';
import logger from '../logger/winston';

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
         const tour = await Tour.findById(req.params.id);
         res.status(200).json({
            message: 'Get tour by id successfully!',
            data: tour,
         });
      } catch (error) {
         logger.error(`Get tour by id error: ${error}`);
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
         const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
         });
         res.status(200).json({
            message: 'Update tour successfully!',
            data: tour,
         });
      } catch (error) {
         logger.error(`Update tour error: ${error}`);
         next(error);
      }
   }

   async deleteTour(req: Request, res: Response, next: NextFunction) {
      try {
         await Tour.findByIdAndDelete(req.params.id);
         res.status(200).json({
            messgage: `Delete tour id: ${req.params.id} successfully!`,
         });
      } catch (error) {
         logger.error(`Delete tour error: ${error}`);
         next(error);
      }
   }
}

export default new TourController();
