import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

const { MONGODB_USER, MONGODB_PASSWORD,MONGODB_HOST,MONGODB_DB } = process.env;

const username = encodeURIComponent(`${MONGODB_USER}`);
const password = encodeURIComponent(`${MONGODB_PASSWORD}`); 
const uri = `mongodb+srv://${username}:${password}@${MONGODB_HOST}/${MONGODB_DB}?retryWrites=true`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 30000, 
  socketTimeoutMS: 30000 
});

const connect = async () => {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } catch (err: any) {
    console.log('Fail to connect to DB: ', err);
  }
};

export default { connect };
