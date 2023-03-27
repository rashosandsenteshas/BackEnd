import { Router } from 'express';
import validarToken from './validar_token.routes.js';  

import {
    getVehiculos,
    getVehiculo,
    postVehiculos,
    postVehiculo,
    putVehiculo,
    deleteVehiculo,
    getUserVehicle
} from '../controllers/vehiculos.controller.js';

const router = Router();

/* obtener todos los vehiculos */
router.get('/vehiculos', validarToken, getVehiculos);

/* obtener un vehiculo en especifico */
router.get('/user/vehiculos/:id', getVehiculo);

/* crear un vehiculo */
router.post('/vehiculos', postVehiculos);

/* borrar un vehiculo */
router.delete('/user/vehiculos/:id', deleteVehiculo);

/* actualizar un vehiculo */
router.patch('/user/vehiculos/', putVehiculo);

/* Ver vehiculos de un usuario en especifico */
router.get('/user/vehiculos/', getUserVehicle)

/* crear vehiculo por id de usuario automatico */
router.post('/user/vehiculos/', postVehiculo);


export default router;
