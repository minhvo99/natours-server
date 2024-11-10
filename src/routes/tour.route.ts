import express from 'express';
import {
   aliasTopTours,
   createTour,
   deleteTour,
   getAllTour,
   getDistances,
   getMonthlyPlan,
   getTourbyId,
   getTourStast,
   getTourWithin,
   updateTour,
} from '../controllers/Tour.controller';
import { authorization, restrictTo } from '../controllers/Auth.controller';
import reviewRoute from './review.route';
// import { createReview } from '../controllers/Review.controller';

const tourRoute = express.Router();

tourRoute.use('/:id/reviews', reviewRoute);
tourRoute.get('/top-5-cheap', aliasTopTours, getAllTour);
tourRoute.get('/tour-stast', getTourStast);
tourRoute.get(
   '/monthly-plan/:year',
   authorization,
   restrictTo('admin', 'lead-guide', 'guide'),
   getMonthlyPlan,
);
tourRoute.get('/tours-within/:distance/center/:latlng/unit/:unit', getTourWithin);
tourRoute.get('/distances/:latlng/unit/:unit', getDistances);
tourRoute
   .route('/')
   .get(authorization, getAllTour)
   .post(authorization, restrictTo('admin', 'lead-guide'), createTour);
tourRoute
   .route('/:id')
   .get(getTourbyId)
   .put(authorization, restrictTo('admin', 'lead-guide'), updateTour)
   .delete(authorization, restrictTo('admin', 'lead-guide'), deleteTour);

// tourRoute.post('/:id/reviews', authorization, restrictTo('guest'), createReview);

export default tourRoute;
