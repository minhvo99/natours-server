export interface IUser {
   _id?: string | any;
   name: string;
   email: string;
   photo?: string;
   password: string;
   passWordConfirm?: string;
   correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
}
