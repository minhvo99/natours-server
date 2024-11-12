import { Document } from 'mongoose';
import { Types } from 'mongoose';

export interface IReview extends Document {
   review: string;
   rating: number;
   createdAt: Date;
   tour: Types.ObjectId;
   user: Types.ObjectId;
   calcAverageRating(tourId: Types.ObjectId): Promise<[]>;
}
