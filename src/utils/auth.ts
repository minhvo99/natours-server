import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();
const SERECT = process.env.JWT_SECRET_KEY as Secret;
const expiresIn = process.env.JWT_EXPIRE_IN;

export const signToken = (user: any): string => {
   const { id, name, email, role } = user;
   return jwt.sign({ id, name, email, role }, SERECT, { expiresIn: expiresIn });
};

// export const refreshToken =

export const comparePassWord = async (
   candidatePassWord: string,
   userPassWord: string,
): Promise<boolean> => {
   return await bcrypt.compare(candidatePassWord, userPassWord);
};
