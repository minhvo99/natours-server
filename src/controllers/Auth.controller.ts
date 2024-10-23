import User from '../model/User.model';
import { Request, Response, NextFunction } from 'express';
import logger from '../logger/winston';
import AppError from '../utils/appError';
import dotenv from 'dotenv';
import { IUser } from '../constans/User';
import { signToken } from '../utils/auth';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
dotenv.config();
const SERECT = process.env.JWT_SECRET_KEY as Secret;

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
   try {
      // let password = req.body.password;
      // const hashedPassword = await bcrypt.hash(password, 12);
      // req.body.password = hashedPassword;
      // req.body.passWordConfirm = undefined;
      const newUser = await User.create({
         name: req.body.name,
         email: req.body.email,
         password: req.body.password,
         passWordConfirm: req.body.passWordConfirm,
         passWordChangeAt: req.body.passWordChangeAt || null
      });
      const token = signToken(newUser.name, newUser._id);
      res.status(201).json({
         message: 'Create a new user successfully!',
         token: token,
      });
   } catch (error) {
      logger.error(`Create user error: ${error}`);
      next(error);
   }
};

export const logIn = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { email, password } = req.body;
      if (!email || !password) {
         return next(new AppError(`Please provice email and password!`, 400));
      }
      const user = (await User.findOne({ email }).select('+password')) as IUser;

      if (!user || !(await user.correctPassword(password, user.password))) {
         return next(new AppError('Incorrect email or password', 401));
      }
      const token = signToken(user.name, user._id);
      res.status(200).json({
         status: 'Login successfuly',
         token: token,
      });
   } catch (error) {
      logger.error(`Login error: ${error}`);
      next(error);
   }
};

export const authorization = async (req: Request, res: Response, next: NextFunction) => {
   //1) getting token and check of if's there
   try {
      let token = '';
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
         token = req.headers.authorization.split(' ')[1];
      }
      if (!token) {
         return next(new AppError('You are not logged in!', 401));
      }
      //2) verify token
      const decoded: string | JwtPayload = jwt.verify(token, SERECT);

      // 3) Check if user still exists
      const freshUser = await User.findById((decoded as JwtPayload).id);
      if (!freshUser) {
         return next(new AppError('The user belonging to this token does no longer exits', 401));
      }

      const as = freshUser.changePasswordAfter((decoded as JwtPayload).iat as number);

      // 4) Check if user changed password after the token was issued

      next();
   } catch (error) {
      logger.error('Authorization fail: ' + error);
      next(error);
   }
};
