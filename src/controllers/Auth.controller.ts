import User from '../model/User.model';
import express, { Request, Response, NextFunction, CookieOptions } from 'express';
import logger from '../logger/winston';
import AppError from '../utils/appError';
import dotenv from 'dotenv';
import { IUser } from '../constans/User';
import { signToken } from '../utils/auth';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import Email from '../utils/email';
import crypto from 'crypto';

dotenv.config();
const SERECT = process.env.JWT_SECRET_KEY as Secret;

const createSendToken = (user: any, statusCode: number, res: Response) => {
   const token = signToken(user);
   const cookieOption: CookieOptions = {
      expires: new Date(
         Date.now() + Number(process.env.JWT_COOKIE_EXPIRE_IN) * 24 * 60 * 60 * 1000, //90days
      ),
      httpOnly: true,
   };

   if (process.env.NODE_ENV === 'production') cookieOption.secure = true;

   //Remove the password from output
   user.password = undefined;

   res.cookie('jwt', token, cookieOption);
   res.status(statusCode).json({
      message: 'Success!',
      data: {
         token,
         role: user.role,
      },
   });
};

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
   try {
      // let password = req.body.password;
      // const hashedPassword = await bcrypt.hash(password, 12);
      // req.body.password = hashedPassword;
      // req.body.passWordConfirm = undefined;
      //Import dev data
      // const data = await User.create(req.body, { validateBeforeSave: false });
      // res.status(201).json({
      //    message: 'import user success fully',
      //    data,
      // });
      const newUser = await User.create({
         name: req.body.name,
         email: req.body.email,
         password: req.body.password,
         passWordConfirm: req.body.passWordConfirm,
         passWordChangeAt: req.body.passWordChangeAt || null,
      });
      const url = `${req.protocol}://${req.get('host')}/api/v1/user/me`;
      await new Email(newUser, url).sendWelcome();
      createSendToken(newUser, 201, res);
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
      const user = (await User.findOne({ email }).select('+password +active')) as IUser;

      if (!user || !(await user.correctPassword(password, user.password))) {
         return next(new AppError('Incorrect email or password', 401));
      }

      if (!user || !user.active) {
         return next(new AppError('User account is inactive or does not exist.', 404));
      }
      createSendToken(user, 200, res);
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
      const currentUser = await User.findById((decoded as JwtPayload).id).select('+active');
      if (!currentUser) {
         return next(new AppError('The user belonging to this token does no longer exits', 401));
      }

      if (!currentUser.active) {
         return next(
            new AppError('Your account has been deactivated. Please contact support.', 403),
         );
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

export const restrictTo = (...roles: string[]) => {
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

   try {
      const resetURL = `${req.protocol}://${req.get('host')}/api/v1/reset-password/${resetToken}`;
      await new Email(user, resetURL).sendPassWordReset();

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

export const resetPassWord = async (req: Request, res: Response, next: NextFunction) => {
   try {
      //1) Get user based on the token
      const hashedToken = crypto.createHash('sha256').update(req.params?.token).digest('hex');

      const user = await User.findOne({
         passWordResetToken: hashedToken,
         passWordResetExpires: { $gt: Date.now() },
      });

      //2) IF token has not expired, and there is user, set the new password
      if (!user) {
         return next(new AppError('Token is invalid or has expired!', 400));
      }

      user.password = req.body.password;
      user.passWordConfirm = req.body.passWordConfirm;
      user.passWordResetToken = undefined;
      user.passWordResetExpires = undefined;

      await user.save({ validateBeforeSave: false });

      //3) Update changePasswordAt property for the user

      //4) Log the user in, send JWT
      createSendToken(user, 200, res);
   } catch (error) {
      logger.error(`Fail to reset password: ${error}`);
      next(error);
   }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
   try {
      //1) Get user from collection
      const user = (await User.findById((req as any).user.id).select('+password')) as IUser;
      //2) Check if POSTed current password is correct
      if (!(await user.correctPassword(req.body.passWordCurrent, user.password))) {
         return next(new AppError('Your current password is wrong', 401));
      }
      //3) If so, update password

      user.password = req.body.password;
      user.passWordConfirm = req.body.passWordConfirm;

      await user.save();

      //4) Log the user in, send JWT
      createSendToken(user, 200, res);
   } catch (error) {
      logger.error(`Fail to reset password: ${error}`);
      next(error);
   }
};

export const activeAccount = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const result = await User.findOneAndUpdate({ email: req.body.email }, { active: true });
      if (!result) {
         return next(new AppError(`User with email ${req.body.email} does not exist`, 404));
      }

      res.status(200).json({
         message: `User with email ${req.body.email} activated successfully!`,
         data: result,
      });
   } catch (error) {
      logger.error(`Fail to active account: ${error}`);
      next(error);
   }
};
