import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

export const connect = () => {

    mongoose.set("strictQuery", false);
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => { 
        console.log("DB CONNECTED!");
    })
    .catch(err => {
        console.log(err);
        console.log("DB NOT CONNECTED!");
    });

};
