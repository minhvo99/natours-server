import { NextFunction, Request, Response } from 'express';
import Tour from '../model/Tour.model';

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
         res.json({
            message: `An error occurred: ${error}`,
         });
         next();
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
         res.json({
            message: `An error occurred: ${error}`,
         });
         next();
      }
   }

   async createTour(req: Request, res: Response, next: NextFunction) {
      try {
         const newTour = await Tour.create(req.body);
         res.status(201).json({
            message: 'Create a new tour successfully!',
            data: newTour,
         });
      } catch (error) {
         res.json({
            message: `An error occurred: ${error}`,
         });
         next();
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
         res.json({
            message: `An error occurred: ${error}`,
         });
         next();
      }
   }

   async deleteTour(req: Request, res: Response, next: NextFunction) {
      try {
         await Tour.findByIdAndDelete(req.params.id);
         res.status(204).json({
            messgage: 'Delete tour successfully!',
         });
      } catch (error) {
         res.status(400).json({
            message: `Cannot delete tour id: ${req.params.id}`,
            error: error,
         });
      }
   }
}

export default new TourController();
