import express from 'express';
import tourRoute from './tour.route';
import userRoute from './user.route';
import authRoute from './auth.route';
const appRouter = express.Router();

appRouter.use('', authRoute);
appRouter.use('/tour', tourRoute);
appRouter.use('/user', userRoute);

export default appRouter;
