import mongoose from 'mongoose';
import { Query } from 'mongoose';
import { IBooking } from 'src/constans/Booking';

const bookingSchema = new mongoose.Schema<IBooking>({
   tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tout',
      required: [true, 'Booking must belong to a Tour!'],
   },
   user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a User!'],
   },
   price: {
      type: Number,
      required: [true, 'Booking must have a price'],
   },
   createdAt: {
      type: Date,
      default: Date.now(),
   },
   paid: {
      type: Boolean,
      default: true,
   },
});

bookingSchema.pre(/^find/, function (this: Query<unknown, unknown>, next) {
   this.populate('user').populate({
      path: 'tour',
      select: 'name',
   });
   next();
});

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
