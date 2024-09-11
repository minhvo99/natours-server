import { NextFunction } from 'express';
import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';

const tourSchemas = new Schema(
   {
      name: {
         type: String,
         required: [true, 'A tour must have a name'],
         unique: true,
         trim: true,
      },
      duration: {
         type: Number,
         required: [true, 'A tour must have a duration'],
      },
      slug: String,
      maxGroupSize: {
         type: Number,
         required: [true, 'A tour must have a group size'],
      },
      difficulty: {
         type: String,
         required: [true, 'A tour must have a difficulty'],
      },
      ratingsQuantity: {
         type: Number,
         default: 0,
      },
      ratingsAvarage: {
         type: Number,
         default: 4.5,
      },
      price: {
         type: Number,
         required: [true, 'A tour must have a price'],
      },
      priceDiscount: Number,
      summary: {
         type: String,
         trim: true,
         required: [true, 'A tour must have a summary'],
      },
      description: {
         type: String,
         trim: true,
         required: [true, 'A tour must have a description'],
      },
      imageCover: {
         type: String,
         required: [true, 'A tour must have a cover image'],
      },
      images: [String],
      createdAt: {
         type: Date,
         default: Date.now(),
      },
      startDates: [Date],
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   },
);

tourSchemas.virtual('durationWeeks').get(function () {
   return (this.duration / 7).toFixed(1);
});

tourSchemas.pre('save', function (next) {
   this.slug = slugify(this.name, { lower: true });
   next();
});

const Tour = mongoose.model('Tour', tourSchemas);

export default Tour;
