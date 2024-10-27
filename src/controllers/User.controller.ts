import User from '../model/User.model';
import { Request, Response, NextFunction } from 'express';
import logger from '../logger/winston';
import AppError from '../utils/appError';

const filterObj = (obj: { [key: string]: any }, ...allowUpdated: string[]) => {
   const newObj: { [key: string]: any } = {};
   Object.keys(obj).forEach((field: string) => {
      if (!allowUpdated.includes(field)) {
         newObj[field] = obj[field];
      }
   });
   return newObj;
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const users = await User.find({ active: { $ne: false } });
      res.status(200).json({
         message: 'Get all users successfully!',
         data: users,
      });
   } catch (error) {
      logger.error(`Get all user error: ${error}`);
      next(error);
   }
};

export const updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
   try {
      //1) Create error if user POST password data
      if (req.body.password || req.body.passWordConfirm) {
         return next(
            new AppError(
               'This route is not for password updated. Please use /change-password.',
               400,
            ),
         );
      }

      //2) Update user document

      const userUpdate = filterObj(req.body, 'role');
      const user = await User.findByIdAndUpdate((req as any).user.id, userUpdate, {
         new: true,
         runValidators: true,
      });

      res.status(200).json({
         status: 'success',
         user,
      });
   } catch (error) {}
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const result = await User.findByIdAndUpdate((req as any).user.id, { active: false});
      if (!result) {
         return next(new AppError(`User with id ${(req as any).user.id} does not exist`, 404));
      }

      res.status(204).json({
         message: `User with id ${(req as any).user.id} deleted successfully!`,
         data: null
      });
   } catch (error) {
      logger.error(`Fail to deleteUSer: ${error}`);
      next(error);
   }
};
