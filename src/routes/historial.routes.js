import { Router } from "express";

import { getHistorial, getHistorialPorFecha  } from "../controllers/historial.controller.js"

const router = new Router();

// Add routes

router.get('/user/historial', getHistorial);
router.get('/user/historial', getHistorialPorFecha );

export default router
