import express from 'express';
import {
   activeAccount,
   authorization,
   forgotPassWord,
   logIn,
   resetPassWord,
   restrictTo,
   signUp,
   updatePassword,
} from '../controllers/Auth.controller';
const authRoute = express.Router();

authRoute.post('/sign-up', signUp);
authRoute.post('/log-in', logIn);
authRoute.post('/forgot-password', forgotPassWord);
authRoute.patch('/reset-password/:token', resetPassWord);
authRoute.patch('/change-password', authorization, updatePassword);
authRoute.patch('/active-account', authorization, restrictTo('admin'), activeAccount);

export default authRoute;
