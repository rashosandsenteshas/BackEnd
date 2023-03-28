import { Router } from "express";

import { getHistorial, getHistorialPorFechas  } from "../controllers/historial.controller.js"

const router = new Router();

// Add routes

router.get('/user/historial', getHistorial);
router.post('/user/historial-fecha', getHistorialPorFechas );

export default router
