import express from 'express';
import { forgotPassWord, logIn, resetPassWord, signUp } from '../controllers/Auth.controller';
const authRoute = express.Router();

authRoute.post('/sign-up', signUp);
authRoute.post('/log-in', logIn);
authRoute.post('/forgot-password', forgotPassWord);
authRoute.post('/reset-password', resetPassWord);

export default authRoute;
