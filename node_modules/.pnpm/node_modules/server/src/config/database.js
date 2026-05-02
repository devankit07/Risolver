import { config } from "./config.js";
import mongoose from 'mongoose';

export const connectDB = async () =>{
    mongoose.connect(config.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });
}
