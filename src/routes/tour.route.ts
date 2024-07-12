import express from 'express';
import { getAllTour } from './../controllers/Tour.controller'

const tourRoute = express.Router();

tourRoute.get('/', getAllTour)

export default tourRoute;
