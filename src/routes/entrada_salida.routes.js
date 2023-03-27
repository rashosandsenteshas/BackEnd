import { Router } from 'express';
import {
    getEntrada_salidas,
    getEntrada_salida,
    postEntrada_salida,
    putEntrada_salida,
    deleteEntrada_salida,
    getUserVehiculo,
    getVehiculo
} from '../controllers/entrada_salida.controller.js';

const router = Router();

/* ruta para obetener todos las entrada y salidas */
router.get('/entrada-salida', getEntrada_salidas);

/* ruta para obetener una entrada y salidas en especifico (por ID) */
router.get('/user/entrada-salida/', getEntrada_salida);

/* obtener los vehiculos del usuario */
router.get('/user/usuarios/:id_usuarios/vehiculos', getUserVehiculo);

router.get('/user/usuarios/:id_usuarios/vehiculos/:id_vehiculo', getVehiculo);

/* digitar la entrada y salida del usuario con su vehiculo */
router.post('/user/usuarios/:id_usuarios/vehiculos/:id_vehiculo/entrada-salida', postEntrada_salida);

/* ruta para actualizar una entrada y salidas */
router.patch('/user/usuarios/entrada-salida/', putEntrada_salida);

/* ruta para eliminar una entrada y salidas */
router.delete('/user/entrada-salida/', deleteEntrada_salida);

export default router;
