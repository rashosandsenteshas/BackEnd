import { pool } from '../db.js';
import jwt from 'jsonwebtoken'

/* obtener todos los vehiculos */
export const getVehiculos = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM vehiculos');
        res.status(200).json({ rows });
    } catch (error) {return res.status(500).json({message: 'Algo no ha ocurrido bien',});}
};

/* obtener un vehiculo en especifico por id*/
export const getVehiculo = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM vehiculos WHERE id_vehiculo = ?',[req.params.id]);

        if (rows.length <= 0)return res.status(404).json({message: 'El vehiculo no existe',});
        res.status(200).json(rows[0]);
    } catch (error) {return res.status(500).json({message: 'Algo no ha ocurrido bien',});}
};

/* crear un vehiculo */

export const postVehiculos = async (req, res) => {
    const { id_usuarios, tipo_vehiculo, placa, marca, modelo, color } = req.body;

    /* Validar que la placa no exista en la base de datos */
    const vehicleExists = await pool.query('SELECT * FROM vehiculos WHERE placa = ?',[placa]);

    if (vehicleExists > [0])return res.status(400).json({ message: 'El vehiculo ya esta registrado' });

    if (!tipo_vehiculo || !placa || !marca || !modelo || !color)return res.status(400).json({message:' Campos sin diligenciar, por favor, llene todos los campos ',
        });

    try {
        const [rows] = await pool.query('INSERT INTO vehiculos (id_usuarios, tipo_vehiculo, placa, marca, modelo, color) VALUES (?, ?, ?, ?, ?, ?)',
            [id_usuarios, tipo_vehiculo, placa, marca, modelo, color]
        );
        res.status(200).send({
            id: rows.insertId,
            tipo_vehiculo,
            placa,
            marca,
            modelo,
            color,
        });
    } catch (error) { return res.status(500).json({message: 'ALgo va mal',});}
};

/* Eliminar un vehiculo */
export const deleteVehiculo = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        await connection.query("DELETE FROM aseguradora WHERE id_vehiculo = ?", [req.params.id]);
        const result = await connection.query("DELETE FROM vehiculos WHERE id_vehiculo = ?", [req.params.id]);
        await connection.commit();
        connection.release();

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'El vehiculo no se encuentra registrado' });
        }
        
        res.status(204).json({message: "Vehiculo eliminado correctamente"});
    } catch (error) { 
        return res.status(500).json({ message: 'Algo no ha ocurrido bien', error}); 
    }
};



/* Actualizar un vehiculo */
export const putVehiculo = async (req, res) => {
    const { tipo_vehiculo, placa, marca, modelo, color } = req.body;

    const headerToken = req.headers['authorization']
    const tokenVehiculo = headerToken.slice(7);
    const tokenverify = jwt.verify(tokenVehiculo, process.env.VEHICULOS || 'Stigmata14');
    const vehiculoId = tokenverify.id_vehiculo

    const [vehicleExists] = await pool.query('SELECT * FROM vehiculos WHERE placa = ?',[placa]);
    if (vehicleExists >= [0]) return res.status(400).json({ message: `Ya existe un registro de un vehiculo con la placa ${placa}` });

    try {
        const [result] = await pool.query(
            'UPDATE vehiculos SET tipo_vehiculo = IFNULL(?, tipo_vehiculo), placa = IFNULL(?, placa), marca = IFNULL(?, marca), modelo = IFNULL(?, modelo), color = IFNULL(?, color) WHERE id_vehiculo = ?',
            [tipo_vehiculo, placa, marca, modelo, color, vehiculoId]
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: 'El vehiculo no ha sido eliminado debido a que no existe', });

        const [rows] = await pool.query( 'SELECT * FROM vehiculos WHERE id_vehiculo = ?', [vehiculoId] );
        res.json(rows[0]);
    } catch (error) { return res.status(500).json({ message: 'Algo no ha ocurrido bien', });}
};

/* Ver el vehiculo por id de usuario */
export const getUserVehicle = async (req, res) => {

    const headerToken = req.headers['authorization']
    const token = headerToken.slice(7);
    const tokenverify = jwt.verify(token, process.env.SECRET_KEY || 'Stigmata14');
    const userId = tokenverify.id_usuarios
    // console.log(userId);
    // const token = req.headers.authorization.split(' ')[1];
    // const tokenverify = jwt.verify(token, process.env.SECRET_KEY || 'Stigmata14');
    // const userId = tokenverify.id_usuarios

    try {
        const [rows] = await pool.query( 'SELECT * FROM vehiculos WHERE id_usuarios = ?', [userId] );

        if (rows.length <= 0) return res.status(404).json({ message: 'Parece que NO tienes vehiculos registrados.', });
        res.status(200).json(rows);
    } catch (error) { return res.status(500).json({ message: 'Algo no ha ocurrido bien', })}
};


/* crear vehiculo con id logueado */
export const postVehiculo = async (req, res) => {
    const {  tipo_vehiculo, placa, marca,  modelo, color } = req.body;

    /* validamos que el usuario digite todos los campos de la tabla */
    if (!tipo_vehiculo || !placa || !marca || !modelo || !color) return res.status(400).json({message:' Campos sin diligenciar, por favor, llene todos los campos',});

    /* Validar que la placa no exista en la base de datos */
    const [vehicleExists] = await pool.query('SELECT * FROM vehiculos WHERE placa = ?',[placa]);
    if (vehicleExists >= [0]) return res.status(400).json({ message: `Ya existe un registro con la placa ${placa}` });

    /* validamos que digite una placa valida */
    if(placa.length > 7 ) return res.status(400).json({ message: "Ingrese una placa valida. Ejm: HYD-236" })

    
    /* verificamos el token que creamos en el login */

    // const token = req.headers.authorization.split(' ')[1];
    const headerToken = req.headers['authorization']
    const token = headerToken.slice(7);
    const tokenverify = jwt.verify(token, process.env.SECRET_KEY || 'Stigmata14');
    const userId = tokenverify.id_usuarios
    // console.log(userId);

    try {
        const [rows] = await pool.query('INSERT INTO vehiculos (id_usuarios, tipo_vehiculo, placa, marca, modelo, color) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, tipo_vehiculo, placa, marca, modelo, color]);

        const Payload = {
            id_vehiculo: rows.insertId,
            id_usuarios: userId,
            tipo_vehiculo,
            placa,
            marca,
            modelo,
            color
        }
        // console.log(Payload);
        const tokenVehiculo = jwt.sign(Payload, process.env.VEHICULOS || 'stigmata14')
        res.status(200).json(tokenVehiculo)

        // res.status(200).send({
        //     id_vehiculo: rows.insertId,
        //     id_usuarios: userId,
        //     tipo_vehiculo,
        //     placa,
        //     marca,
        //     modelo,
        //     color,
        // });
    } catch (error) { return res.status(500).json({ message: 'ALgo va mal', }); }
};