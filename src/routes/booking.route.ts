import express from 'express';
import { authorization, restrictTo } from 'src/controllers/Auth.controller';
import {
   createBooking,
   deleteBooking,
   getAllBookings,
   getBooking,
   updateBooking,
} from 'src/controllers/Booking.controller';

const bookingRoute = express.Router();

// bookingRoute.get('/checkout-session/:id', authorization, getCheckoutSession);
bookingRoute
   .route('/')
   .get(authorization, restrictTo('admin', 'lead-guide'), getAllBookings)
   .post(authorization, restrictTo('admin', 'lead-guide'), createBooking);

// user booking routes
bookingRoute
   .route('/:id')
   .get(authorization, restrictTo('admin', 'lead-guide'), getBooking)
   .patch(authorization, restrictTo('admin', 'lead-guide'), updateBooking)
   .delete(authorization, restrictTo('admin', 'lead-guide'), deleteBooking);

export default bookingRoute;
