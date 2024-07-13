import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const { MONGODB_USER, MONGODB_PASSWORD,MONGODB_HOST,MONGODB_DB } = process.env;

const username = encodeURIComponent(`${MONGODB_USER}`);
const password = encodeURIComponent(`${MONGODB_PASSWORD}`); 
const uri = `mongodb+srv://${username}:${password}@${MONGODB_HOST}/${MONGODB_DB}?retryWrites=true`;


const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Database connected successfully!");
  } catch (err: any) {
    console.log('Fail to connect to DB: ', err);
  }
};

export default { connect };
