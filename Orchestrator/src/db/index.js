import dns from "node:dns";
import mongoose from "mongoose";
import { WifiNode } from "../models/wifi_node.models.js"
import {DB_NAME} from "../constants.js"

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async function(){
   try {
      const connectionInstance = await mongoose.connect(`${process.env.MONGODB_CONNECTION_URL}/${DB_NAME}`);
      console.log(`MONGODB Connected !! DB HOST: ${connectionInstance.connection.host}`);
   } catch (error) {
      console.log(`MongoDB connectin FAILED!: ${error}`);
      process.exit(1);
   }
}

const disconnectDB = async function(){
   try {

      await WifiNode.collection.drop();
      console.log(`DB deletion successfull, gracefully shutting down the server`)

      await mongoose.disconnect();
      console.log(`DB disconnected successfully`);
  
   } catch (error) {
      console.log(`DB deletion failed!: ${error}`);
      process.exit(1)
   }
}

export {
   connectDB,
   disconnectDB
};