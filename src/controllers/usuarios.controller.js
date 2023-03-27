import { pool } from "../db.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

/* Obtener todos los usuarios */
export const getUsuarios = async (req, res) => {
	try {
		// throw new Error("DB error")
		const [rows] = await pool.execute("SELECT * FROM usuarios");
		res.status(200).json({ rows });
	} catch (error) {
		return res.status(500).json({message: "ALgo va mal",});
	}
};

/* Obtener un usuario por id */
export const getUsuario = async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM usuarios WHERE id_usuarios = ?",[req.params.id_usuarios]);

		if (rows.length <= 0)
			return res.status(404).json({message: "El usuario no existe",});

		res.status(200).json(rows[0]);
	} catch (error) {
		return res.status(500).json({message: "ALgo va mal",});
	}
};

/* Crear usuarios */
export const postUsuarios = async (req, res, next) => {
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
        const [rows] = await pool.query('INSERT INTO usuarios (nombre, apellido, correo, contrasena) VALUES (?, ?, ?, ?)',[nombre, apellido, correo, passHash]
        );
        res.status(200).json({ msg: 'usuario creado exitosamente' });
    } catch (error) {
        return res.status(500).json({
            message: 'Algo va mal',
            error,
        });
    }
};

/* Eliminar un usuario en especifico */
export const deleteUsuarios = async (req, res) => {
  const { id_usuarios } = req.params;

  try {
    // Comenzar la transacción
    await pool.query('START TRANSACTION');

    // Eliminar los reportes del usuario
    await pool.query('DELETE FROM reportes WHERE id_usuarios = ?', [id_usuarios]);
	await pool.query("DELETE FROM vehiculos WHERE id_usuarios = ?",[id_usuarios]);

    // Eliminar el usuario
    const [result] = await pool.query('DELETE FROM usuarios WHERE id_usuarios = ?', [id_usuarios]);

    // Si no se eliminó ningún usuario, lanzar un error
    if (result.affectedRows <= 0) {
      throw new Error('Usuario no existe');
    }

    // Confirmar la transacción
    await pool.query('COMMIT');

    res.sendStatus(204);
  } catch (error) {
    // Deshacer la transacción en caso de error
    await pool.query('ROLLBACK');

    res.status(500).json({ message: 'Algo va mal', error });
  }
};

/* Actualizar un usuario en especifico */
export const putUsuarios = async (req, res) => {
	const { nombre, apellido, correo } = req.body;

	const headerToken = req.headers['authorization']
    const token = headerToken.slice(7);
    const tokenverify = jwt.verify(token, process.env.SECRET_KEY || 'Stigmata14');
    const userId = tokenverify.id_usuarios

	/* Verificamos si el usuario ya existe en la base de datos */
	const userExists = await pool.query('SELECT * FROM usuarios WHERE correo = ?',[correo]);
	if (userExists > [0]) return res.status(400).json({ message: 'El correo ya esta en uso' });

	try {
		const [result] = await pool.query("UPDATE usuarios SET nombre = IFNULL(?, nombre), apellido = IFNULL(?, apellido), correo = IFNULL(?, correo) WHERE id_usuarios = ?",[nombre, apellido, correo, userId]);

		if (result.affectedRows === 0)
			return res.status(404).json({message: "No se puede actualizar ya que el usuario no existe.",});

		const [rows] = await pool.query("SELECT * FROM usuarios WHERE id_usuarios = ?", [userId]);
		res.json(rows[0]);
	} catch (error) {
		return res.status(500).json({message: "ALgo va mal",});
	}
};


/* Actualizamos solo la contraseña y la encriptamos de nuevo*/
export const putUserPassword = async (req, res) => {
	const { contrasena } = req.body;

	const headerToken = req.headers['authorization']
    const token = headerToken.slice(7);
    const tokenverify = jwt.verify(token, process.env.SECRET_KEY || 'Stigmata14');
    const userId = tokenverify.id_usuarios

	let passHash = await bcrypt.hash(contrasena, 10);

	try {
		const [result] = await pool.query("UPDATE usuarios SET contrasena = ? WHERE id_usuarios = ?", [passHash, userId]);

		if (result.affectedRows === 0)
			return res.status(404).json({message: "No se puede actualizar ya que el usuario no existe.",});

		const [rows] = await pool.query("SELECT * FROM usuarios WHERE id_usuarios = ?",[userId]);
		res.json(rows[0]);
	} catch (error) {
		return res.status(500).json({message: "ALgo va mal",});
	}
};


export const getUserVehiculo = async (req, res) => {
	const { id } = req.params
	// console.log(id);
	const sql = `SELECT * FROM vehiculos WHERE id_usuarios = ${id}`	
	const [result] = await pool.query(sql)

	res.json(result)
}

export const getUsuariosById = async (req, res) => {
	const headerToken = req.headers['authorization']
    const token = headerToken.slice(7);
    const tokenverify = jwt.verify(token, process.env.SECRET_KEY || 'Stigmata14');
    const userId = tokenverify.id_usuarios
    // console.log(userId);

	try {
		const [rows] = await pool.query("SELECT * FROM usuarios WHERE id_usuarios = ?",[userId]);

		if (rows.length <= 0) return res.status(404).json({message: "El usuario no existe",});

		res.status(200).json(rows[0]);
	} catch (error) {
		return res.status(500).json({message: "ALgo va mal",});
	}
}

/* buscador */ 
export const buscador = async (req, res) => {
	const query = req.query.query;

	try {
		const [rows] = await pool.execute(`SELECT * FROM usuarios WHERE nombre LIKE "${query}"`);
		res.status(200).json( rows );
	} catch (error) {
		// console.error(error);
		return res.status(500).json({ message: "Algo va mal", });
	}
};