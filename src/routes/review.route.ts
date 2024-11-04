import express from 'express';
import { authorization, restrictTo } from '../controllers/Auth.controller';
import {
   createReview,
   getAllReviews,
   deleteReview,
   updateReview,
   setUserandIdUser,
   getReviewById,
} from '../controllers/Review.controller';

const reviewRoute = express.Router({ mergeParams: true });

reviewRoute
   .route('/')
   .get(authorization, getAllReviews)
   .post(authorization, restrictTo('guest'), setUserandIdUser, createReview);

reviewRoute
   .route('/:id')
   .get(authorization, getReviewById)
   .patch(authorization, restrictTo('guest'), updateReview)
   .delete(authorization, restrictTo('guest'), deleteReview);

export default reviewRoute;
