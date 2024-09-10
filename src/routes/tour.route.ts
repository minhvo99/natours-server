import express from 'express';
import {
   aliasTopTours,
   createTour,
   deleteTour,
   getAllTour,
   getTourbyId,
   updateTour,
} from '../controllers/Tour.controller';

const tourRoute = express.Router();
tourRoute.get('/top-5-cheap', aliasTopTours, getAllTour);
tourRoute.get('/', getAllTour);
tourRoute.get('/:id', getTourbyId);
tourRoute.post('/', createTour);
tourRoute.put('/:id', updateTour);
tourRoute.delete('/:id', deleteTour);

export default tourRoute;
