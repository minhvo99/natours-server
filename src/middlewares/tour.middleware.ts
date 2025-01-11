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
               const defaultImageCover = fs.readFileSync('publict/tours/banner-01.jpg');
               doc.imageCover = `data:image/jpeg;base64,${defaultImageCover.toString('base64')}`;
            }
         } else {
            const defaultImageCover = fs.readFileSync('publict/tours/banner-01.jpg');
            doc.imageCover = `data:image/jpeg;base64,${defaultImageCover.toString('base64')}`;
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
                        const defaultImage = fs.readFileSync('publict/tours/banner-02.jpg');
                        return `data:image/jpeg;base64,${defaultImage.toString('base64')}`;
                     }
                  } else {
                     const defaultImage = fs.readFileSync('publict/tours/banner-03.jpg');
                     return `data:image/jpeg;base64,${defaultImage.toString('base64')}`;
                  }
               })
               .filter((image: any | string) => image !== null);
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
            const defaultImage = fs.readFileSync('publict/tours/banner-02.jpg');
            doc.imageCover = `data:image/jpeg;base64,${defaultImage.toString('base64')}`;
         }
      } else {
         const defaultImage = fs.readFileSync('publict/tours/banner-03.jpg');
         doc.imageCover = `data:image/jpeg;base64,${defaultImage.toString('base64')}`;
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
                     const defaultImage = fs.readFileSync('publict/tours/banner-02.jpg');
                     return `data:image/jpeg;base64,${defaultImage.toString('base64')}`;
                  }
               } else {
                  const defaultImage = fs.readFileSync('publict/tours/banner-02.jpg');
                  return `data:image/jpeg;base64,${defaultImage.toString('base64')}`;
               }
            })
            .filter((image: any) => image !== null);
      }
   }
   next();
};
