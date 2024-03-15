import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function runMongoose() {
    try {

        console.log('mode => ', process.env.MODE_TEST);

        if (process.env.MODE_TEST == 'true') {
            await mongoose.connect('mongodb://127.0.0.1:27017/proyecto');
            console.log('Using MODE_TEST = true');
        } else {
            await mongoose.connect('mongodb://127.0.0.1:27017/proyecto');
            console.log('Production mode');
        }


    } catch (error) {
        console.log('error on connection');
    }
}

export default runMongoose;