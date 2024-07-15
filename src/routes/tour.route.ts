import express from 'express';
import tourController from './../controllers/Tour.controller';

const tourRoute = express.Router();

tourRoute.get('/', tourController.getAllTour);
tourRoute.get('/:id', tourController.getTourbyId);
tourRoute.post('/', tourController.createTour);
tourRoute.put('/:id', tourController.updateTour);
tourRoute.delete('/:id', tourController.deleteTour);

export default tourRoute;
