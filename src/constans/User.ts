export interface IUser {
   _id?: string | any;
   name: string;
   email: string;
   photo?: string;
   password: string;
   passWordConfirm?: string;
   passWordChangeAt?: Date;
   correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
   changePasswordAfter (JWTTimestamp: number): Promise<boolean>;
}
