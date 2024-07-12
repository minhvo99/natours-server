import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const { CLUSTER, MONGODB_USER, MONGODB_PASSWORD, ENV } = process.env;

const username = encodeURIComponent(`${MONGODB_USER}`);
const password = encodeURIComponent(`${MONGODB_PASSWORD}`);
const cluster = CLUSTER;

const uri = `mongodb+srv://${username}:${password}@${cluster}.rscee18.mongodb.net/`;

const client = new MongoClient(uri);

const connect = async () => {
  try {
    await client.connect();
    console.log('Connected!!!');
  } catch (err: any) {
    console.log('Fail to connect to DB: ', err);
  } finally {
    await client.close();
  }
};

export default connect;
