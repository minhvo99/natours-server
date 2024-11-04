import express from 'express';
import tourRoute from './tour.route';
import userRoute from './user.route';
import authRoute from './auth.route';
import reviewRoute from './review.route';
const appRouter = express.Router();

appRouter.use('', authRoute);
appRouter.use('/tour', tourRoute);
appRouter.use('/user', userRoute);
appRouter.use('/review', reviewRoute);

export default appRouter;
