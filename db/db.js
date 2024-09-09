import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"
const connectDB=async()=>{
    try {
        const connectioninstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`\n mongodb connected successfully`);
    } catch (error) {
        console.log("Error : ",err);
        process.exit(1);   
    }
}
export default connectDB;