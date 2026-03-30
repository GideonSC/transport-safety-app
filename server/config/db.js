import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/transport-safety';

  try {
    await mongoose.connect(uri, {
      family: 4,
    });
    console.log('MongoDB connected');
    return true;
  } catch (error) {
    console.warn('MongoDB connection failed:', error.message);
  }

  try {
    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();

    await mongoose.connect(memoryUri, {
      family: 4,
    });
    console.log('MongoDB in-memory server connected');
    return true;
  } catch (memoryError) {
    console.error('Failed to start in-memory database:', memoryError.message);
    return false;
  }
};

export default connectDB;
