import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from '../logger/winston';

dotenv.config();

const { MONGODB_PASSWORD, MONGODB_HOST, MONGODB_DB, MONGODB_USER, CLUSTER } = process.env;
const password = encodeURIComponent(`${MONGODB_PASSWORD}`);
const uri = `mongodb+srv://${MONGODB_USER}:${password}@${MONGODB_HOST}/${MONGODB_DB}?retryWrites=true&w=majority&appName=${CLUSTER}`;
console.log(`Enviroment: ${process.env.NODE_ENV}`);
const connect = async () => {
   try {
      await mongoose.connect(uri);
      logger.info('Database connected successfully');
   } catch (err: any) {
      logger.error(`Database connection error: ${err}`);
   }
};

export default { connect };
