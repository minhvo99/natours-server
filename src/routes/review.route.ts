import express from 'express';
import { authorization, restrictTo } from '../controllers/Auth.controller';
import { createReview, getAllReviews, deleteReview } from '../controllers/Review.controller';

const reviewRoute = express.Router({ mergeParams: true });

reviewRoute.route('/').get(authorization, getAllReviews).post(authorization, createReview);

reviewRoute.delete('/:id', authorization, deleteReview);

export default reviewRoute;
