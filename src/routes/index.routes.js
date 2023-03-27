import { Router } from "express";
import { getRoutes } from "../controllers/index.controller";


const router = new Router();

// Add routes

router.get('/ping', getRoutes);


export default router
