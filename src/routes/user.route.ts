import express from 'express';
import { createUser, deleteUser, getAllUsers } from '../controllers/User.controller';
const userRoute = express.Router();

userRoute.get('/', getAllUsers);
userRoute.post('/', createUser);
userRoute.delete('/:id', deleteUser);

export default userRoute;
