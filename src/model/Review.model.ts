import mongoose, { Schema } from 'mongoose';

const reviewSchemas = new Schema({});

const Review = mongoose.model('Review', reviewSchemas);

export default Review;
