import express from 'express';
import { authorization, restrictTo } from '../controllers/Auth.controller';
import { createReview, getAllReviews } from '../controllers/Review.controller';

const reviewRoute = express.Router();

reviewRoute.get('/all-review', getAllReviews);
reviewRoute.post('/new-review', authorization, createReview);

export default reviewRoute;
