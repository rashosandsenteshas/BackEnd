import { pool } from '../db.js';
import jwt from 'jsonwebtoken'

/* Obtener todas las aseguradoras */
export const getAseguradoras = async (req, res) => {
    try {
        // throw new Error("DB error")
        const [rows] = await pool.execute('SELECT * FROM aseguradora');
        res.status(200).json({ rows });
    } catch (error) {
        return res.status(500).json({
            message: 'ALgo va mal',
        });
    }
};

/* Obtener una aseguradora por id de vehiculo*/
export const getAseguradora = async (req, res) => {

    const headerToken = req.headers['authorization']
    const tokenVehiculo = headerToken.slice(7);
    const tokenverify = jwt.verify(tokenVehiculo, process.env.VEHICULOS || 'Stigmata14');
    const vehiculoId = tokenverify.id_vehiculo
    // console.log(vehiculoId);

    try {
        const [rows] = await pool.query(
            'SELECT * FROM aseguradora WHERE id_vehiculo = ?',
            [vehiculoId]
        );

        if (rows.length <= 0)
            return res.status(404).json({
                message: 'La aseguradora no existe',
            });

        res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'ALgo va mal',
        });
    }
};

/* Crear aseguradora */
export const postAseguradora = async (req, res) => {
    const { nombre_aseguradora, fecha_expedicion, fecha_vencimiento, } = req.body;

    const headerToken = req.headers['authorization']
    const tokenVehiculo = headerToken.slice(7);
    const tokenverify = jwt.verify(tokenVehiculo, process.env.VEHICULOS || 'Stigmata14');
    const vehiculoId = tokenverify.id_vehiculo
    try {
        const [rows] = await pool.query('INSERT INTO aseguradora (id_vehiculo, nombre_aseguradora, fecha_expedicion, fecha_vencimiento) VALUES (?, ?, ?, ?)',
            [ vehiculoId, nombre_aseguradora, fecha_expedicion, fecha_vencimiento, ]
        );

        const Payload = {
            id_aseguradora: rows.insertId,
            id_vehiculo: vehiculoId,
            nombre_aseguradora,
            fecha_expedicion,
            fecha_vencimiento
        }

        const tokenAseguradora = jwt.sign(Payload, process.env.ASEGURADORA || "Stigmata14") 
        res.status(200).json(tokenAseguradora)

        // res.status(200).send({
        //     id: rows.insertId,
        //     id_vehiculo: vehiculoId,
        //     nombre_aseguradora,
        //     fecha_expedicion,
        //     fecha_vencimiento,
        // });
    } catch (error) {
        return res.status(500).json({
            message: 'Algo va mal', error
        });
    }
};

/* Eliminar una aseguradora en especifico */
export const deleteAseguradora = async (req, res) => {

    const headerToken = req.headers['authorization']
    const tokenAseguradora = headerToken.slice(7);
    const tokenverify = jwt.verify(tokenAseguradora, process.env.ASEGURADORA || 'Stigmata14');
    const aseguradoraId = tokenverify.id_aseguradora

    try {
        const [result] = await pool.query(
            'DELETE FROM aseguradora WHERE id_aseguradora = ?',
            [aseguradoraId]
        );

        if (result.affectedRows <= 0)
            return res.status(404).json({
                message: 'La aseguradora no existe',
            });

        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({
            message: 'ALgo va mal',
        });
    }
};

/* Actualizar una aseguradora en especifico */
export const putAseguradora = async (req, res) => {
    const {
        id_vehiculo,
        nombre_aseguradora,
        fecha_expedicion,
        fecha_vencimiento,
    } = req.body;

    const headerToken = req.headers['authorization']
    const tokenAseguradora = headerToken.slice(7);
    const tokenverify = jwt.verify(tokenAseguradora, process.env.ASEGURADORA || 'Stigmata14');
    const aseguradoraId = tokenverify.id_aseguradora

    try {
        const [result] = await pool.query(
            'UPDATE aseguradora SET id_vehiculo = IFNULL(?, id_vehiculo), nombre_aseguradora = IFNULL(?, nombre_aseguradora), fecha_expedicion = IFNULL(?, fecha_expedicion), fecha_vencimiento = IFNULL(?, fecha_vencimiento) WHERE id_aseguradora = ? ',
            [
                id_vehiculo,
                nombre_aseguradora,
                fecha_expedicion,
                fecha_vencimiento,
                aseguradoraId,
            ]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({
                message:
                    'No se puede actualizar ya que la aseguradora no existe.',
            });

        const [rows] = await pool.query(
            'SELECT * FROM aseguradora WHERE id_aseguradora = ?',
            [aseguradoraId]
        );
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'ALgo va mal',
        });
    }
};
