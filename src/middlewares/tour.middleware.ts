import fs from 'fs';
import logger from '../logger/winston';
import { NextFunction } from 'express';

export const enhanceDocsWithImages = function (docs: any, next: NextFunction) {
   const basePath = 'publics/tours/';
   if (Array.isArray(docs)) {
      docs.forEach((doc) => {
         const imageCoverPath = `${basePath}${doc.imageCover}`;
         if (fs.existsSync(imageCoverPath)) {
            try {
               const imageCover = fs.readFileSync(imageCoverPath);
               doc.imageCover = `data:image/jpeg;base64,${imageCover.toString('base64')}`;
            } catch (err) {
               logger.error('Error reading imageCover:', err);
            }
         } else {
            logger.error('Image not found for imageCover:', imageCoverPath);
         }
         if (Array.isArray(doc.images)) {
            doc.images = doc.images
               .map((image: string) => {
                  const imagePath = `${basePath}${image}`;
                  if (fs.existsSync(imagePath)) {
                     try {
                        const imageFile = fs.readFileSync(imagePath);
                        return `data:image/jpeg;base64,${imageFile.toString('base64')}`;
                     } catch (err) {
                        logger.error('Error reading image:', err);
                        return null;
                     }
                  } else {
                     logger.error('Image not found:', imagePath);
                     return null;
                  }
               })
               .filter((image: any) => image !== null);
         }
      });
   } else {
      const doc = docs;

      const imageCoverPath = `${basePath}${doc.imageCover}`;
      if (fs.existsSync(imageCoverPath)) {
         try {
            const imageCover = fs.readFileSync(imageCoverPath);
            doc.imageCover = `data:image/jpeg;base64,${imageCover.toString('base64')}`;
         } catch (err) {
            logger.error('Error reading imageCover:', err);
         }
      } else {
         logger.error('Image not found for imageCover:', imageCoverPath);
      }

      if (Array.isArray(doc.images)) {
         doc.images = doc.images
            .map((image: string) => {
               const imagePath = `${basePath}${image}`;
               if (fs.existsSync(imagePath)) {
                  try {
                     const imageFile = fs.readFileSync(imagePath);
                     return `data:image/jpeg;base64,${imageFile.toString('base64')}`;
                  } catch (err) {
                     logger.error('Error reading image:', err);
                     return null;
                  }
               } else {
                  logger.error('Image not found:', imagePath);
                  return null;
               }
            })
            .filter((image: any) => image !== null);
      }
   }
   next();
};
