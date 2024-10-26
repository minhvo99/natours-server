import { Document } from 'mongoose';
export interface IUser extends Document {
   name: string;
   email: string;
   photo?: string;
   password: string;
   passWordConfirm?: string;
   passWordChangeAt?: Date | any;
   role: string;
   passWordResetToken?: string;
   passWordResetExpires?: Date;
   correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
   changePasswordAfter(JWTTimestamp: number): boolean;
   createPasswordResetToken(): string;
}
export interface AuthRequestBody {
   name?: string;
   email: string;
   password: string;
   passWordConfirm?: string;
   passWordChangeAt?: Date;
   passWordCurrent?: string;
}