import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

async function dbConnect() {
  if (cached && cached.connection && cached.connection.readyState === 1) {
    return cached.connection;
  }

  if (!cached) {
    cached = global.mongoose = { connection: null };
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 20000,
    });
    
    cached.connection = connection;
    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Database connection failed');
  }
}

export default dbConnect;
