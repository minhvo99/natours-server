import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();
const SERECT = process.env.JWT_SECRET_KEY as Secret;
const REFRESH_SERECT = process.env.JWT_REFRESH_KEY as Secret;
const accessTokenExpiresIn = process.env.JWT_EXPIRE_IN || '1h'; 
const refreshTokenExpiresIn = process.env.JWT_REFRESH_KEY_EXPIRE_IN || '7d';

export const signToken = (user: any) => {
   const { id } = user;
   const accessToken = jwt.sign({ id }, SERECT, { expiresIn: accessTokenExpiresIn });
   const refreshToken = jwt.sign({ id }, REFRESH_SERECT, { expiresIn: refreshTokenExpiresIn });
   return { accessToken, refreshToken };
};

// export const refreshToken =

export const comparePassWord = async (
   candidatePassWord: string,
   userPassWord: string,
): Promise<boolean> => {
   return await bcrypt.compare(candidatePassWord, userPassWord);
};
