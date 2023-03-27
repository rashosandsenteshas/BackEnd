import { Router } from 'express';
// import validarToken from './validar_token.routes.js';

import {
    getUsuarios,
    postUsuarios,
    putUsuarios,
    deleteUsuarios,
    getUsuario,
    putUserPassword,
    getUsuariosById,
    buscador,
} from '../controllers/usuarios.controller.js';

const router = Router();

/* ruta para obetener todos los usuarios */
router.get('/usuarios', getUsuarios);

/* ruta para obetener un usuario en especifico (por ID) */
router.get('/user/usuarios/:id_usuarios', getUsuario);

/* Ruta para obtener la informacion del usuario logueado */
router.get('/user/usuarios/', getUsuariosById);

/* ruta para crear un usuario */
router.post('/usuarios', postUsuarios);

/* ruta para actualizar un usuario */
router.patch('/user/usuarios/', putUsuarios);

/* Actualizar contrasena encriptada */
router.put('/user/usuarios/', putUserPassword);

/* ruta para eliminar un usuario */
router.delete('/user/usuarios/:id_usuarios', deleteUsuarios);

/* buscador por nombre */
router.get('/users/usuarios', buscador);

export default router;
