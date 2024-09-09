import express from 'express';
import UserController from '../controllers/User.controller';
const userRoute = express.Router();
const userController = new UserController();

export default userRoute;
