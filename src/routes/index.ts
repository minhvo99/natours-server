import express from 'express';
import tourRoute from './tour.route';
import userRoute from './user.route';
import authRoute from './auth.route';
import reviewRoute from './review.route';
import bookingRoute from './booking.route';
const appRouter = express.Router();

appRouter.use('', authRoute);
appRouter.use('/tour', tourRoute);
appRouter.use('/user', userRoute);
appRouter.use('/review', reviewRoute);
appRouter.use('/bookings', bookingRoute);

export default appRouter;
