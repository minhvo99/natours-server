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
import { authorization } from '../controllers/Auth.controller';

const tourRoute = express.Router();
tourRoute.get('/top-5-cheap', aliasTopTours, getAllTour);
tourRoute.get('/tour-stast', getTourStast);
tourRoute.get('/monthly-plan/:year', getMonthlyPlan);
tourRoute.get('/', authorization, getAllTour);
tourRoute.get('/:id', getTourbyId);
tourRoute.post('/', createTour);
tourRoute.put('/:id', updateTour);
tourRoute.delete('/:id', deleteTour);

export default tourRoute;
