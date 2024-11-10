import { Query } from 'mongoose';
import { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';
import { ITour } from '../constans/Tour';

const tourSchemas = new Schema<ITour>(
   {
      name: {
         type: String,
         required: [true, 'A tour must have a name'],
         unique: true,
         trim: true,
         maxlength: [40, 'A tour name must have less or equal than 40 characters'],
         minlength: [10, 'A tour name must have more or equal than 10 characters'],
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
         enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty  is either: easy, medium, or difficult',
         },
      },
      ratingsQuantity: {
         type: Number,
         default: 0,
      },
      ratingsAverage: {
         type: Number,
         default: 4.5,
         min: [1, 'Rating must be above 1.0'],
         max: [5, 'Rating must be above 5.0'],
         set: (val: number) => Math.round(val * 10) / 10,
      },
      price: {
         type: Number,
         required: [true, 'A tour must have a price'],
      },
      priceDiscount: {
         type: Number,
         validate: {
            validator: function (this: Document, val: number) {
               return val < this.get('price');
            },
            message: 'Discount price should be below the regular price',
         },
      },
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
      secretTour: {
         type: Boolean,
         default: false,
      },
      startLocation: {
         //GeoJson
         type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
         },
         coordinates: [Number],
         address: String,
         desciption: String,
      },
      location: [
         {
            type: {
               type: String,
               default: 'Point',
               enum: ['Point'],
            },
            coordinates: [Number],
            address: String,
            desciption: String,
            day: Number,
         },
      ],
      guides: [
         {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
         },
      ],
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   },
);
// set Indexes for improving read performance docs. 1 is asc, -1 is desc
tourSchemas.index({ price: 1, ratingsAverage: -1 });
// tourSchemas.index({ slug: 1 });
tourSchemas.index({ startLocation: '2dsphere' });

// VIRTUAL PROPERTIES
tourSchemas.virtual('durationWeeks').get(function () {
   if (!this.duration) {
      return undefined;
   }
   return (this.duration / 7).toFixed(1);
});

// Vitural populated
tourSchemas.virtual('reviews', {
   ref: 'Review',
   foreignField: 'tour',
   localField: '_id',
});

// DOCUMENT MIDDLEWARE: runs before .save() and  .create()
tourSchemas.pre('save', function (next) {
   this.slug = slugify(this.name, { lower: true });
   next();
});

tourSchemas.pre(/^find/, function (this: Query<unknown, unknown>, next) {
   this.select('-__v'); // Exclude the __v field from the results
   next();
});

tourSchemas.pre(/^find/, function (this: Query<unknown, unknown>, next) {
   this.populate({
      path: 'guides',
      select: '-passWordChangeAt -role',
   });
   next();
});

// tourSchemas.pre('save', async function (next) {
//    const guidesPromises = this.guides.map(async (id: string) => await User.findById(id).select('-passWordChangeAt'))
//    this.guides = await Promise.all(guidesPromises)
//    next();
// });

// tourSchemas.pre('save', function (next) {
//    if (this.priceDiscount != null && this.price != null && this.priceDiscount >= this.price) {
//       throw new Error('Discount price should be below the regular price');
//    }
//    next();
// });

//QUERY MIDDLEWARE
tourSchemas.pre(/^find/, function (this: Query<unknown, unknown>, next) {
   this.find({ secretTour: { $ne: true } });
   next();
});

// AGGREGATE MIDDLEWARE
// tourSchemas.pre('aggregate', function (next) {
//    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//    console.log(this.pipeline());
//    next();
// });
const Tour = mongoose.model<ITour>('Tour', tourSchemas);

export default Tour;
