import mongoose, { Schema, Types } from 'mongoose';
import { IReview } from '../constans/Review';
import { Query } from 'mongoose';
import Tour from './Tour.model';

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

reviewSchemas.index({ tour: 1, user: 1 }, { unique: true });

reviewSchemas.pre(/^find/, function (this: Query<unknown, unknown>, next) {
   this.select('-__v');
   next();
});

reviewSchemas.pre(/^find/, function (this: Query<unknown, unknown>, next) {
   //  this.populate({
   //     path: 'tour',
   //     select: 'name',
   //  }).populate({
   //     path: 'user',
   //     select: 'name photo',
   //  });
   this.populate({
      path: 'user',
      select: 'name photo',
   });
   next();
});

reviewSchemas.statics.calcAverageRating = async function (tourId: Types.ObjectId) {
   const stats = await this.aggregate([
      {
         $match: { tour: tourId },
      },
      {
         $group: {
            _id: '$tour',
            nRating: { $sum: 1 },
            avgRating: { $avg: '$rating' },
         },
      },
   ]);
   if (stats.length > 0) {
      await Tour.findByIdAndUpdate(tourId, {
         ratingsQuantity: stats[0].nRating,
         ratingsAverage: stats[0].avgRating,
      });
   } else {
      await Tour.findByIdAndUpdate(tourId, {
         ratingsQuantity: 0,
         ratingsAverage: 0,
      });
   }
};

reviewSchemas.post('save', function () {
   const ReviewModel = this.constructor as unknown as IReview;
   ReviewModel.calcAverageRating(this.tour);
});

reviewSchemas.pre(/^findOneAnd/, async function (next) {
   const doc = await Tour.findOne();
   this.set('result', doc);
   next();
});

reviewSchemas.post(/^findOneAnd/, async function (doc) {
   if (doc) {
      await doc.constructor.calcAverageRating(doc.tour);
   }
});

const Review = mongoose.model<IReview>('Review', reviewSchemas);

export default Review;
