import User from '../model/User.model';
import { Request, Response, NextFunction } from 'express';
import logger from '../logger/winston';
import AppError from '../utils/appError';
// import bcrypt from 'bcrypt';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const users = await User.find();
      res.status(200).json({
         message: 'Get all users successfully!',
         data: users,
      });
   } catch (error) {
      logger.error(`Get all user error: ${error}`);
      next(error);
   }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
   try {
      // let password = req.body.password;
      // const hashedPassword = await bcrypt.hash(password, 12);
      // req.body.password = hashedPassword;
      // req.body.passWordConfirm = undefined;
      const newUser = await User.create(req.body);
      res.status(201).json({
         message: 'Create a new user successfully!',
         data: newUser,
      });
   } catch (error) {
      logger.error(`Create user error: ${error}`);
      next(error);
   }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const result = await User.findByIdAndDelete(req.params.id);
      if (!result) {
         return next(new AppError(`User with id ${req.params.id} does not exist`, 404));
      }

      res.status(204).json({
         message: `User with id ${req.params.id} deleted successfully!`,
      });
   } catch (error) {
      logger.error(`Fail to deleteUSer: ${error}`);
      next(error);
   }
};
