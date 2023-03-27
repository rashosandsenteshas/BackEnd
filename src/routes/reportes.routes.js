import { Router } from 'express';
import validarToken from './validar_token.routes.js';

import {
    getReportes,
    getReporte,
    postReporte,
    putReporte,
    deleteReporte,
    postReportes,
    getUserReporte
} from '../controllers/reportes.controller.js';

const router = Router();

/* obtener todos los reportes */
router.get('/reportes', getReportes);

/* obtener un reporte en especifico */
router.get('/reportes/:id', getReporte);

/* crear un reporte */
router.post('/reportes', postReportes);

/* actualizar un reporte */
router.patch('/user/reportes', putReporte);

/* borrar un reporte */
router.delete('/user/reportes', deleteReporte);

/* Ver vehiculos de un usuario en especifico */
router.get('/user/reportes', getUserReporte)

/* crear vehiculo por id de usuario automatico */
router.post('/user/reportes', postReporte);

export default router;
