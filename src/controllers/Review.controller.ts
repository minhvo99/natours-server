import { NextFunction, Request, Response } from 'express';
import Review from '../model/Review.model';
import logger from '../logger/winston';
import { deleteOne } from './HandleFactory';

export const getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
   try {
      let filter = {};
      if (req.params.id) filter = { tour: req.params.id };
      const review = await Review.find(filter);
      res.status(200).json({
         message: 'Get all review successfully!',
         total: review.length,
         data: review,
      });
   } catch (error) {
      logger.error(`Fail to get all review: ${error}`);
      next(error);
   }
};

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
   try {
      if (!req.body.tour) req.body.tour = req.params.id;
      const newReview = await Review.create({
         ...req.body,
         user: (req as any).user.id,
      });
      res.status(201).json({
         message: 'Create new review successfully!',
         data: {
            review: newReview,
         },
      });
   } catch (error) {
      logger.error(`Fail to create new review: ${error}`);
      next(error);
   }
};

export const deleteReview = deleteOne(Review, 'Delete a veview');
