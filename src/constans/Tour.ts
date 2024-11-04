import { Document } from 'mongoose';
export interface ITour extends Document {
   name: string;
   duration: number;
   slug?: string;
   maxGroupSize: number;
   difficulty: 'easy' | 'medium' | 'difficult';
   ratingsQuantity?: number;
   ratingsAverage?: number;
   price: number;
   priceDiscount?: number;
   summary: string;
   description: string;
   imageCover: string;
   images?: string[];
   createdAt?: Date;
   startDates?: Date[];
   secretTour?: boolean;
   startLocation?: {
      type: 'Point';
      coordinates: number[];
      address?: string;
      description?: string;
   };
   location?: Array<{
      type: 'Point';
      coordinates: number[];
      address?: string;
      description?: string;
      day: number;
   }>;
   guides: any[];
}
