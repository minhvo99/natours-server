import User from '../model/User.model';
import { Request, Response, NextFunction } from 'express';
import logger from '../logger/winston';
export default class UserController {
   async getAllUsers(req: Request, res: Response, next: NextFunction) {
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
   }
}
