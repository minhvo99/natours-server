import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { IUser } from '../constans/User';

const userSchema = new Schema<IUser>({
   name: {
      type: String,
      required: [true, 'Please tell us your name'],
   },
   email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
   },
   photo: String,
   password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
   },
   passWordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
         //this only works on CREATE and SAVE !!!
         validator: function (this: any, value: string) {
            return value === this.password;
         },
         message: 'Passwords are not the same',
      },
   },
   // role: String,
   // active: Boolean,
});

// Hash the password before saving to the database
userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) return next();

   this.password = await bcrypt.hash(this.password, 12);
   this.passWordConfirm = undefined;
   next();
});
userSchema.methods.correctPassword = async function (
   candidatePassword: string,
   userPassword: string,
) {
   return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
