import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const connectDB = async function(){
 try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_CONNECTION_URL}/${DB_NAME}`);
    console.log(`MONGODB Connected !! DB HOST: ${connectionInstance.connection.host}`);
 } catch (error) {
    console.log(`MongoDB connectin FAILED!: ${error}`);
    process.exit(1);
 }
}

export default connectDB;