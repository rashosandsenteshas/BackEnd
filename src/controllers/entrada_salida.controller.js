import { pool } from '../db.js';
import jwt  from 'jsonwebtoken';

/* Obtener todos las entradas y salidas */
export const getEntrada_salidas = async (req, res) => {
    try {
        // throw new Error("DB error")
        const [rows] = await pool.execute('SELECT * FROM entrada_salida');
        res.status(200).json({ rows });
    } catch (error) {
        return res.status(500).json({
            message: 'ALgo va mal',
        });
    }
};

/* Obtener una entrada y salida por id  de usuario*/
export const getEntrada_salida = async (req, res) => {

    const headerToken = req.headers['authorization']
    const token = headerToken.slice(7);
    const tokenverify = jwt.verify(token, process.env.SECRET_KEY || 'Stigmata14');
    const userId = tokenverify.id_usuarios

    try {
        const [rows] = await pool.query(
            'SELECT * FROM entrada_salida WHERE id_usuarios = ?',
            [userId]
        );

        if (rows.length <= 0)
            return res.status(404).json({
                message: 'El registro de entrada y salida no existe',
            });

        res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'ALgo va mal',
        });
    }
};

/* Eliminar un entrada y salida en especifico */
export const deleteEntrada_salida = async (req, res) => {

    const headerToken = req.headers['authorization']
    const tokenEntrada_salida = headerToken.slice(7);
    const tokenverify = jwt.verify(tokenEntrada_salida, process.env.ENTRADA_SALIDA || 'Stigmata14');
    const entrada_salidaId = tokenverify.id_entrada_salida

    try {
        const [result] = await pool.query(
            'DELETE FROM entrada_salida WHERE id_entrada_salida = ?',
            [entrada_salidaId]
        );

        if (result.affectedRows <= 0)
            return res.status(404).json({
                message: 'reporte de fecha no existe',
            });

        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({
            message: 'ALgo va mal',
        });
    }
};

/* Actualizar una entrada y salida en especifico */
export const putEntrada_salida = async (req, res) => {
    
    const headerToken = req.headers['authorization']
    const tokenEntrada_salida = headerToken.slice(7);
    const tokenverify = jwt.verify(tokenEntrada_salida, process.env.ENTRADA_SALIDA || 'Stigmata14');
    const entrada_salidaId = tokenverify.id_entrada_salida
    

    const {
        fecha_ingreso,
        fecha_salida,
        hora_ingreso,
        hora_salida,
    } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE entrada_salida SET fecha_ingreso = IFNULL(?, fecha_ingreso), fecha_salida = IFNULL(?, fecha_salida),hora_ingreso = IFNULL(?, hora_ingreso), hora_salida = IFNULL(?, hora_salida) WHERE id_entrada_salida = ?',
            [
                fecha_ingreso,
                fecha_salida,
                hora_ingreso,
                hora_salida,
                entrada_salidaId,
            ]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({
                message:
                    'No se puede actualizar ya que el reporte de fechas no existe.',
            });

        const [rows] = await pool.query(
            'SELECT * FROM entrada_salida WHERE id_entrada_salida = ?',
            [entrada_salidaId]
        );
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'ALgo va mal', error
        });
    }
};


/* Obtener los vehiculos del usuario */
export const getUserVehiculo = async (req, res) => {
	const { id_usuarios } = req.params

    
	const sql = `SELECT * FROM vehiculos WHERE id_usuarios = ${id_usuarios}`
    // if(result > [0]){
	// 	res.status(400).json({message: "El usuario no tiene ningun vehiculo registrado"})
	// }
	const [result] = await pool.query(sql)
	res.status(200).json(result)
}

export const postEntrada_salida = async (req, res) => {

    const {id_usuarios} = req.params
    const {id_vehiculo} = req.params

    const {
        fecha_ingreso,
        fecha_salida,
        hora_ingreso,
        hora_salida,
    } = req.body;

    if( !fecha_ingreso || !fecha_salida || !hora_ingreso || !hora_salida ) return res.status(400).json({ message : " Campos sin diligenciar, por favor, llene todos los campos " })


    try {
        const [rows] = await pool.query(
            'INSERT INTO entrada_salida (id_usuarios, id_vehiculo, fecha_ingreso, fecha_salida, hora_ingreso, hora_salida) VALUES (?, ?, ?, ?, ?, ?)',
            [
                id_usuarios,
                id_vehiculo,
                fecha_ingreso,
                fecha_salida,
                hora_ingreso,
                hora_salida,
            ]
        );
    
        const payload = {
            id_entrada_salida: rows.insertId,
            id_usuarios: id_usuarios,
            id_vehiculo: id_vehiculo,
            fecha_ingreso,
            fecha_salida,
            hora_ingreso,
            hora_salida
        }

        const tokenEntrada_salida = jwt.sign(payload, process.env.ENTRADA_SALIDA || "Stigmata14")
        res.status(200).json(tokenEntrada_salida)

    } catch (error) {
        return res.status(500).json({
            message: 'Algo va mal',
        });
    }
};

export const getVehiculo = async (req, res) =>{
    const { id_usuarios, id_vehiculo } = req.params

    
	const sql = `SELECT * FROM vehiculos WHERE id_usuarios = ${id_usuarios} AND id_vehiculo = ${id_vehiculo}`
    // if(result > [0]){
	// 	res.status(400).json({message: "El usuario no tiene ningun vehiculo registrado"})
	// }
	const [result] = await pool.query(sql)
	res.status(200).json(result)
}
