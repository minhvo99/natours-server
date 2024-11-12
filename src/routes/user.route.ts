import express from 'express';
import {
   getAllUsers,
   deleteUser,
   updateMyProfile,
   getUserbyId,
   getCurrentUser,
   uploadUserPhoto,
   reSizephoto,
} from '../controllers/User.controller';
import { authorization, restrictTo } from '../controllers/Auth.controller';
const userRoute = express.Router();

userRoute.get('/', authorization, restrictTo('admin'), getAllUsers);
userRoute.get('/me', authorization, getCurrentUser, getUserbyId);
userRoute.get('/:id', authorization, restrictTo('admin'), getUserbyId);
userRoute.delete('/delete-me', authorization, deleteUser);
userRoute.patch('/update-profile', authorization, uploadUserPhoto, reSizephoto, updateMyProfile);

export default userRoute;
