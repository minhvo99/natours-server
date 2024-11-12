import { NextFunction, Request, Response } from 'express';
import Review from '../model/Review.model';
import logger from '../logger/winston';
import { deleteOne, updateOne, createOne, getOne } from './HandleFactory';
import APIFeature from '../utils/apiFeature';

export const getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
   try {
      let filter = {};
      if (req.params.id) filter = { tour: req.params.id };
      const feature = new APIFeature(Review.find(filter), req.query)
         .filter()
         .sort()
         .limitFields()
         .paginate();
      const review = await feature.query;
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

export const setUserandIdUser = (req: Request, res: Response, next: NextFunction) => {
   if (!req.body.tour) req.body.tour = req.params.id;
   req.body.user = (req as any).user.id;
   next();
};

export const getReviewById = getOne(Review, 'review', '');

export const createReview = createOne(Review, 'Review');

export const updateReview = updateOne(Review, 'Review');

export const deleteReview = deleteOne(Review, 'Delete a veview');
