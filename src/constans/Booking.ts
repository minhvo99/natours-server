import { Document } from 'mongoose';
import { Types } from 'mongoose';

export interface IBooking extends Document {
   tour: Types.ObjectId;
   user: Types.ObjectId;
   price: number;
   createdAt: Date;
   paid: boolean;
}
