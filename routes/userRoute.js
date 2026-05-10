import express from "express";
import { LogInController } from "../controller/userController.js";
import { SignUpController } from "../controller/userController.js";
const userRoute=express();
userRoute.post("/auth/login",LogInController);
userRoute.post("/auth/register",SignUpController)
export default userRoute;

