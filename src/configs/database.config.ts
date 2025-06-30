import mongoose from 'mongoose';
import logger from '../logger/winston';
import dotenv from 'dotenv';

dotenv.config();

// Cache the database connection
let cachedConnection: mongoose.Connection | null = null;

const connect = async (): Promise<void> => {
   // If connection exists, reuse it
   if (cachedConnection) {
      logger.info('Using cached database connection');
      return;
   }

   try {
      const { MONGODB_PASSWORD, MONGODB_HOST, MONGODB_DB, MONGODB_USER, CLUSTER } = process.env;

      if (!MONGODB_PASSWORD || !MONGODB_HOST || !MONGODB_DB || !MONGODB_USER) {
         throw new Error('Missing MongoDB connection parameters');
      }

      const password = encodeURIComponent(`${MONGODB_PASSWORD}`);
      const uri = `mongodb+srv://${MONGODB_USER}:${password}@${MONGODB_HOST}/${MONGODB_DB}?retryWrites=true&w=majority&appName=${CLUSTER}`;

      logger.info(`Environment: ${process.env.NODE_ENV}`);

      // Configure Mongoose
      mongoose.set('strictQuery', false);

      await mongoose.connect(uri, {
         maxPoolSize: 10, // Maintain up to 10 socket connections
         serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
         socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      });

      cachedConnection = mongoose.connection;
      cachedConnection.on('error', (err) => {
         logger.error(`MongoDB connection error: ${err}`);
         cachedConnection = null;
      });

      cachedConnection.on('disconnected', () => {
         logger.warn('MongoDB disconnected');
         cachedConnection = null;
      });

      logger.info('Database connected successfully');
   } catch (err: any) {
      logger.error(`Database connection error: ${err.message}`);
      cachedConnection = null;
      throw err;
   }
};

const disconnect = async (): Promise<void> => {
   if (!cachedConnection) return;

   try {
      await mongoose.disconnect();
      cachedConnection = null;
      logger.info('Database disconnected successfully');
   } catch (err: any) {
      logger.error(`Database disconnection error: ${err.message}`);
   }
};

export default { connect, disconnect };
