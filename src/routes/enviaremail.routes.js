import { Router } from 'express';
import {
    sendCode,
    verifyCode,
    actualizarPassword
} from '../controllers/enviaremail.controller.js';

const router = Router();




router.post('/user/enviar-codigo', sendCode);
router.post('/user/verificar-codigo', verifyCode);
router.put('/user/actualizar-contrasena', actualizarPassword);



export default router;
