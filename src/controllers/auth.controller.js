import { pool } from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/* Registro de usuario */
export const postRegister = async (req, res, next) => {
    const { nombre, apellido, correo, contrasena } = req.body;

    /* Validamos que el usuario digite todos los campos y que tenga como minimo 8 digitos en la contrasena*/
    if( !nombre || !apellido || !correo || !contrasena ) return res.status(400).json({ message : " Campos sin diligenciar, por favor, llene todos los campos " }) 
    if (contrasena.length < 8) return res.status(400).json({ message : " La contrasena debe tener minimo 8 digitos " })

	/* Verificamos si el usuario ya existe en la base de datos */
    const userExists = await pool.query('SELECT * FROM usuarios WHERE correo = ?',[correo]);
    if (userExists > [0]) return res.status(400).json({ message: 'El usuario ya esta registrado' });

	/* encriptamos contrasena y enviamos los datos a la base de datos */
    try {
        let passHash = await bcrypt.hash(contrasena, 10);
        const [rows] = await pool.query(
            'INSERT INTO usuarios (nombre, apellido, correo, contrasena, id_roles) VALUES (?, ?, ?, ?, 2)',
            [nombre, apellido, correo, passHash]
        );
        res.status(200).json({ message: 'usuario creado exitosamente' });
    } catch (error) {
        return res.status(500).json({
            message: 'Algo va mal',
            error
        });
    }
};

/* Inicio de sesion */
export const postLogin = async (req, res) => {
    const { correo, contrasena } = req.body;

    /* Validamos que el usuario dijite todos los campos */
    if(!correo || !contrasena ) return res.status(400).json({ message : " Los campos deben de estar diligenciados, no pueden estar vacios " })

    try {
		/* Validamos si el usuario ya se encuentra registrado en la base de datos */
		const [users]  = await pool.query('SELECT * FROM usuarios WHERE correo = ?',[correo]);

		/* La contrasena encriptada la comparamos con la contrasena que el usuario digite en caso que exista en la base de datos */
		/* le damos acceso si las credenciales concuerdan con las de la base de datos */
		if (users >= [0]) {
			const pass = users[0].contrasena
			bcrypt.compare(contrasena, pass, (err, result) => {
				if(!result) return res.status(500).json({ message: 'Contraseña incorrecta', result })

                /* Generamos un token al momento de que el usuario digite las credenciales correctamente */
                const payload = {
                    id_usuarios : users[0].id_usuarios, 
                    id_roles: users[0].id_roles,
                    nombre: users[0].nombre,
                    apellido : users[0].apellido,
                    correo : users[0].correo
                }
				const token = jwt.sign(payload, process.env.SECRET_KEY || 'Stigmata14')
        		res.status(200).json(token)
                
                // const tokenverify = jwt.verify(token, process.env.SECRET_KEY || 'Stigmata14');

                // console.log(tokenverify.id_roles);
			})
		}else {
			return res.status(400).json({ message: 'El usuario no esta registrado' });
		}

	} catch (error) {
        return res.status(400).json({ error })
    }
};

export const postLoginAdmin = async (req, res) => {
    const { correo, contrasena } = req.body;

    /* Validamos que el usuario dijite todos los campos */
    if(!correo || !contrasena ) return res.status(400).json({ message : " Los campos deben de estar diligenciados, no pueden estar vacios " })

    try {
		/* Validamos si el usuario ya se encuentra registrado en la base de datos */
		const [users]  = await pool.query('SELECT * FROM usuarios WHERE correo = ?',[correo]);

		/* La contrasena encriptada la comparamos con la contrasena que el usuario digite en caso que exista en la base de datos */
		/* le damos acceso si las credenciales concuerdan con las de la base de datos */
		if (users >= [0]) {
			const pass = users[0].contrasena
			bcrypt.compare(contrasena, pass, (err, result) => {
				if(!result) return res.status(500).json({ message: 'Contraseña incorrecta', result })

                /* Generamos un token al momento de que el usuario digite las credenciales correctamente */
                const payload = {
                    id_usuarios : users[0].id_usuarios, 
                    nombre: users[0].nombre,
                    apellido : users[0].apellido,
                    correo : users[0].correo
                }
				const tokenAdmin = jwt.sign(payload, process.env.SECRET_KEY_ADMIN || 'Stigmata14')
        		res.status(200).json(tokenAdmin)
                // console.log(token.id);
			})
		}else {
			return res.status(400).json({ message: 'El usuario no esta registrado' });
		}

	} catch (error) {
        return res.status(400).json({ error })
    }
};

	
	