import express from "express"
import { CreateProject, DeleteById, GetAllProject, GetSingleProject, UpdateProject } from "../controller/projectController.js"
import { isAuthenticate } from "../middleware/AuthMiddleware.js";
isAuthenticate

const projectRoute=express();
projectRoute.post("/projects",isAuthenticate,CreateProject);
projectRoute.delete("/projects/:id",isAuthenticate, DeleteById)
projectRoute.get("/projects",GetAllProject)
projectRoute.get("/projects/:id",GetSingleProject)
projectRoute.put("/projects/:id",UpdateProject)
export default projectRoute


