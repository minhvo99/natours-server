import User from '../model/User.model';
import { Request, Response, NextFunction } from 'express';
import logger from '../logger/winston';
import AppError from '../utils/appError';
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IUser } from '../constans/User';
dotenv.config();
const SERECT = process.env.JWT_SECRET_KEY as Secret;
const expiresIn = process.env.JWT_EXPIRE_IN;
// import bcrypt from 'bcrypt';

const signToken = (id: string | any) => {
   jwt.sign({ id }, SERECT, { expiresIn: expiresIn });
};

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
      });
      const token = signToken(newUser._id);
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
      const token = signToken(user._id);
      res.status(200).json({
         status: 'Login successfuly',
         token: token,
      });
   } catch (error) {}
};
