import express from 'express';
import { getAllUsers, deleteUser } from '../controllers/User.controller';
const userRoute = express.Router();

userRoute.get('/', getAllUsers);
userRoute.delete('/:id', deleteUser);

export default userRoute;
