import { Router } from 'express';
import {
    getAseguradoras,
    getAseguradora,
    postAseguradora,
    putAseguradora,
    deleteAseguradora,
} from '../controllers/aseguradora.controller.js';

const router = Router();

/* obtener todos los aseguradora */
router.get('/aseguradora', getAseguradoras);

/* obtener una aseguradora en especifico */
router.get('/user/aseguradora/', getAseguradora);

/* crear una aseguradora */
router.post('/user/aseguradora/', postAseguradora);

/* actualizar una aseguradora */
router.patch('/user/aseguradora/', putAseguradora);

/* borrar una aseguradora */
router.delete('/user/aseguradora/', deleteAseguradora);

export default router;
