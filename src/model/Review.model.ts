import mongoose, { Schema } from 'mongoose';
import { IReview } from '../constans/Review';
import { Query } from 'mongoose';


const reviewSchemas = new Schema<IReview>(
   {
      review: {
         type: String,
         required: [true, 'Review can not be empty!'],
      },
      rating: {
         type: Number,
         min: 1,
         max: 5,
      },
      createdAt: {
         type: Date,
         default: Date.now,
      },
      tour: {
         type: mongoose.Schema.ObjectId,
         ref: 'Tour',
         required: [true, 'Review must belong to a tour.'],
      },
      user: {
         type: mongoose.Schema.ObjectId,
         ref: 'User',
         required: [true, 'Review must belong to a user.'],
      },
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   },
);

reviewSchemas.pre(/^find/, function (this: Query<unknown, unknown>, next) {
  this.select('-__v');
  next();
});

reviewSchemas.pre(/^find/, function(this: Query<unknown, unknown>, next){
  this.populate({
    path: 'tour',
    select: 'name'
  }).populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});


const Review = mongoose.model<IReview>('Review', reviewSchemas);

export default Review;
