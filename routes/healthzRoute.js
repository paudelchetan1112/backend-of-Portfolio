import express from "express"
import {checkHealth} from "../controller/healthController.js"


const healthzRoute=express();
healthzRoute.get("/",checkHealth);

export default healthzRoute


