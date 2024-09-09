import express from 'express';
import TourController from './../controllers/Tour.controller';

const tourRoute = express.Router();
const tourController = new TourController();
tourRoute.get('/top-5-cheap', tourController.aliasTopTours, tourController.getAllTour)
tourRoute.get('/', tourController.getAllTour);
tourRoute.get('/:id', tourController.getTourbyId);
tourRoute.post('/', tourController.createTour);
tourRoute.put('/:id', tourController.updateTour);
tourRoute.delete('/:id', tourController.deleteTour);

export default tourRoute;
