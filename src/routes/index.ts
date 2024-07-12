import express from 'express';
import tourRoute from './tour.route';
import userRoute from './user.route';
const appRouter = express.Router();

appRouter.use('/', tourRoute);
appRouter.use('/user', userRoute);

export default appRouter;
