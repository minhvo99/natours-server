import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { IUser } from '../constans/User';
import crypto from 'crypto';

const userSchema = new Schema<IUser>(
   {
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
      passWordChangeAt: Date,
      role: {
         type: String,
         enum: ['user', 'guide', 'lead-guide', 'admin'],
         default: 'user',
      },
      passWordResetToken: String,
      passWordResetExpires: Date,
      // active: Boolean,
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   },
);

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

userSchema.methods.changePasswordAfter = function (JTWTimestamp: number) {
   if (this.passWordChangeAt) {
      const changeTimestamp = this.passWordChangeAt.getTime() / 1000;
      return JTWTimestamp < changeTimestamp;
   }
   return false;
};

userSchema.methods.createPasswordResetToken = function () {
   const resetToken = crypto.randomBytes(32).toString('hex');

   this.passWordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

   this.passWordResetExpires = Date.now() + 10 * 60 * 1000; //10 minutes
   console.log({ resetToken }, this.passWordResetToken);

   return resetToken;
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
