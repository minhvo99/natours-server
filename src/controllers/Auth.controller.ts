import User from '../model/User.model';
import { Request, Response, NextFunction } from 'express';
import logger from '../logger/winston';
import AppError from '../utils/appError';
import dotenv from 'dotenv';
import { IUser } from '../constans/User';
import { signToken } from '../utils/auth';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { sendEmail } from '../utils/email';
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
         passWordChangeAt: req.body.passWordChangeAt || null,
      });
      const token = signToken(newUser.name, newUser._id);
      res.status(201).json({
         message: 'Create a new user successfully!',
         token: token,
         data: newUser,
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
   try {
      //1) getting token and check of if's there
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
      const currentUser = await User.findById((decoded as JwtPayload).id);
      if (!currentUser) {
         return next(new AppError('The user belonging to this token does no longer exits', 401));
      }

      // 4) Check if user changed password after the token was issued
      if (currentUser.changePasswordAfter((decoded as JwtPayload).iat as number)) {
         return next(new AppError('User recently changed password! Please log in again.', 401));
      }

      // GRANT ACCESS TO PROTECTED ROUTE
      (req as any).user = currentUser;
      next();
   } catch (error) {
      logger.error('Authorization fail: ' + error);
      next(error);
   }
};

export const restrictTo = (...roles: any[]) => {
   return (req: Request, res: Response, next: NextFunction) => {
      if (!roles.includes((req as any).user.role)) {
         return next(new AppError('You do not have permission.', 403));
      }
      next();
   };
};

export const forgotPassWord = async (req: Request, res: Response, next: NextFunction) => {
   //1) Get user based on POSTed email

   const user = await User.findOne({ email: req.body.email });

   if (!user) {
      return next(new AppError('There is no user with email address.', 404));
   }

   //2) Generate the random reset token
   const resetToken = user.createPasswordResetToken();
   await user.save({ validateBeforeSave: false });

   //3) Send it to user's email

   const resetURL = `${req.protocol}://${req.get('host')}/api/vi/users/reset-password/${resetToken}`;

   const message = `Forgot your password? Submit a PATCH request with your new password and password confirm to: ${resetURL}. 
   \nIf you didn't forget your password, please ignore this email!`;
   try {
      await sendEmail({
         email: user.email,
         subject: 'Your password reset token (valid for 10 min)',
         message,
      });

      res.status(200).json({
         status: 'success',
         message: 'Token sent to mail!',
      });
   } catch (error) {
      logger.error(`An error has occurred when trying to send mail: ${error}`);
      await user.save({ validateBeforeSave: false });
      user.passWordResetToken = undefined;
      user.passWordResetExpires = undefined;
      next(new AppError('There was an error sending the email. Try again later!', 500));
   }
};

export const resetPassWord = (req: Request, res: Response, next: NextFunction) => {};
