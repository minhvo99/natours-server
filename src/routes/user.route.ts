import express from 'express';
import { getAllUsers, deleteUser, updateMyProfile } from '../controllers/User.controller';
import { authorization, restrictTo } from '../controllers/Auth.controller';
const userRoute = express.Router();

userRoute.get('/', authorization, getAllUsers);
userRoute.delete('/:id', authorization, restrictTo('admin'), deleteUser);
userRoute.patch('/update-my-profile', authorization, updateMyProfile)

export default userRoute;
