import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
const MONGODBURI=process.env.MONGODBURI;
if(!MONGODBURI){
    console.log("MOngo db uri not found");
  
}
export const dbConnect=async()=>{
    try{
 const db= await mongoose.connect(MONGODBURI);
if(db){
    console.log("Mongo db connected successfully")
}
    }
catch(error){
    console.log("Error while connecting db", error)
    
}
}