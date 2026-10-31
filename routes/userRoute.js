import express from "express";
import { LogInController } from "../controller/userController.js";
import { SignUpController } from "../controller/userController.js";
import { isAuthenticate } from "../middleware/AuthMiddleware.js";
const userRoute=express();
userRoute.post("/auth/login",LogInController);
userRoute.post("/auth/register",isAuthenticate,SignUpController)
export default userRoute;

