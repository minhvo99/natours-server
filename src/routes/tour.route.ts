import express from 'express';
import {
   aliasTopTours,
   createTour,
   deleteTour,
   getAllTour,
   getMonthlyPlan,
   getTourbyId,
   getTourStast,
   updateTour,
} from '../controllers/Tour.controller';
import { authorization, restrictTo } from '../controllers/Auth.controller';
import reviewRoute from './review.route';
// import { createReview } from '../controllers/Review.controller';

const tourRoute = express.Router();
tourRoute.use('/:id/reviews', reviewRoute);
tourRoute.get('/top-5-cheap', aliasTopTours, getAllTour);
tourRoute.get('/tour-stast', getTourStast);
tourRoute.get('/monthly-plan/:year', getMonthlyPlan);
tourRoute.get('/', authorization, getAllTour);
tourRoute.get('/:id', getTourbyId);
tourRoute.post('/', authorization, restrictTo('admin', 'lead-guide'), createTour);
tourRoute.put('/:id', authorization, restrictTo('admin', 'lead-guide'), updateTour);
tourRoute.delete('/:id', authorization, restrictTo('admin', 'lead-guide'), deleteTour);
// tourRoute.post('/:id/reviews', authorization, restrictTo('guest'), createReview);

export default tourRoute;
