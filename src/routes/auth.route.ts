import express from 'express';
import {
   authorization,
   forgotPassWord,
   logIn,
   resetPassWord,
   signUp,
   updatePassword,
} from '../controllers/Auth.controller';
const authRoute = express.Router();

authRoute.post('/sign-up', signUp);
authRoute.post('/log-in', logIn);
authRoute.post('/forgot-password', forgotPassWord);
authRoute.patch('/reset-password/:token', resetPassWord);
authRoute.patch('/change-password', authorization, updatePassword);

export default authRoute;
