import express from "express";
import dotenv from "dotenv"
import userRoute from "./routes/userRoute.js";
import { dbConnect } from "./database/db.js";
import projectRoute from "./routes/projectRoute.js";
import cors from "cors"

projectRoute
dotenv.config();

const app=express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/api/",userRoute);
app.use("/api/",projectRoute)
console.log(process.env.MONGODBURI);
const port=process.env.PORT||4000;
dbConnect();
app.listen(port,()=>{
  console.log(`Server is running at http://localhost:${port}`)
})