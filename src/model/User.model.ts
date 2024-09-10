import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
   name: {
      type: String,
      required: [true, 'A User must have a name'],
   },
   email: {
      type: String,
      required: [true, 'Please provice a valid email'],
      unique: true,
      lowercase: true,
   },
});
const User = mongoose.model('User', userSchema);

export default User;
