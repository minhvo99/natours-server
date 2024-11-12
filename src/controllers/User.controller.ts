import User from '../model/User.model';
import { Request, Response, NextFunction } from 'express';
import logger from '../logger/winston';
import AppError from '../utils/appError';
import { getOne } from './HandleFactory';
import multer, { FileFilterCallback } from 'multer';
import sharp from 'sharp';

// const multerStorage: StorageEngine = multer.diskStorage({
//    destination: function (
//       req: Request,
//       file: Express.Multer.File,
//       cb: (error: Error | null, destination: string) => void,
//    ) {
//       cb(null, 'publics/imgs');
//    },
//    filename: function (
//       req: Request,
//       file: Express.Multer.File,
//       cb: (error: Error | null, filename: string) => void,
//    ) {
//       const ext = file.mimetype.split('/')[1];
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       cb(null, `user-${(req as any).user.id}-${uniqueSuffix}.${ext}`);
//    },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
   if (file.mimetype.startsWith('image')) {
      cb(null, true);
   } else {
      cb(new AppError('Not an image! Please upload only imaged.', 400));
   }
};

const upload = multer({
   storage: multerStorage,
   fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single('photo');

export const reSizephoto = async (req: Request, res: Response, next: NextFunction) => {
   try {
      if (!req.file) return next();
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      req.file.filename = `user-${(req as any).user.id}-${uniqueSuffix}.jpeg`;
      await sharp(req.file.buffer)
         .resize(500, 500)
         .toFormat('jpeg')
         .jpeg({ quality: 90 })
         .toFile(`publics/imgs/${req.file.filename}`);
      next();
   } catch (error) {
      logger.error(`Fail to reSizePhoto: ${error}`);
      next(error);
   }
};
const filterObj = (obj: { [key: string]: any }, ...allowUpdated: string[]) => {
   const newObj: { [key: string]: any } = {};
   Object.keys(obj).forEach((field: string) => {
      if (allowUpdated.includes(field)) {
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

export const getUserbyId = getOne(User, 'get user', '');

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
   req.params.id = (req as any).user.id;
   next();
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

      const userUpdate = filterObj(req.body, 'email', 'name');
      if (req.file) userUpdate.photo = req.file.filename;
      const user = await User.findByIdAndUpdate((req as any).user.id, userUpdate, {
         new: true,
         runValidators: true,
      });

      res.status(200).json({
         status: 'success',
         user,
      });
   } catch (error) {
      logger.error(`Update profile fail: ${error}`);
      next(error);
   }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const result = await User.findByIdAndUpdate((req as any).user.id, { active: false });
      if (!result) {
         return next(new AppError(`User with id ${(req as any).user.id} does not exist`, 404));
      }

      res.status(204).json({
         message: `User with id ${(req as any).user.id} deleted successfully!`,
         data: null,
      });
   } catch (error) {
      logger.error(`Fail to deleteUSer: ${error}`);
      next(error);
   }
};
