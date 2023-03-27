import { Router } from 'express';

import { postLogin, postRegister, postLoginAdmin } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', postLogin)
router.post('/register', postRegister)
router.post('/loginAdmin', postLoginAdmin)

export default router