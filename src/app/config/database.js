import mongoose from "mongoose";

import { MONGO_URI } from process.env;
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
