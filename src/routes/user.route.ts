import express from 'express';
import { getAllUsers, deleteUser, updateMyProfile } from '../controllers/User.controller';
import { authorization, restrictTo } from '../controllers/Auth.controller';
const userRoute = express.Router();

userRoute.get('/', authorization, restrictTo('admin'), getAllUsers);
userRoute.delete('/delete-user', authorization, restrictTo('admin'), deleteUser);
userRoute.patch('/update-profile', authorization, updateMyProfile);

export default userRoute;
