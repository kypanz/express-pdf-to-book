import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function runMongoose() {
  try {
    console.log('Production mode enabled ? => ', process.env.MODE_TEST);
    if (process.env.MODE_TEST == 'true') {
      await mongoose.connect('mongodb://127.0.0.1:27017/proyecto');
    } else {
      await mongoose.connect('mongodb://127.0.0.1:27017/proyecto');
    }
  } catch (error) {
    console.log('error on connection');
  }
}

export default runMongoose;
