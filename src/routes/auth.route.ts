import express from 'express';
import { logIn, signUp } from '../controllers/Auth.controller';
const authRoute = express.Router();

authRoute.post('/sign-up', signUp);
authRoute.post('/log-in', logIn);

export default authRoute;
