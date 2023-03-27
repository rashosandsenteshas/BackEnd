import { pool } from "../db.js";
import jwt from "jsonwebtoken"

/* obtener todos los reportes */
export const getReportes = async (req, res) => {
	try {
		const [rows] = await pool.execute("SELECT * FROM reportes");
		res.status(200).json({ rows });
	} catch (error) {
		return res.status(500).json({
			message: "Algo no ha ocurrido bien",
		});
	}
};

/* obtener un reporte en especifico por id*/
export const getReporte = async (req, res) => {
	const {id_usuarios} = req.params
	try {
		const [rows] = await pool.query(
			"SELECT * FROM reportes WHERE id_usuarios = ?",
			[id_usuarios]
		);

		if (rows.length <= 0)
			return res.status(404).json({
				message: "El usuario no cuenta con reportes existentes",
			});
		res.status(200).json(rows[0]);
	} catch (error) {
		return res.status(500).json({
			message: "Algo no ha ocurrido bien",
		});
	}
};

/* crear un reporte */
export const postReportes = async ({ body }, res) => {
	const { id_usuarios, fecha_suceso, descripcion } = body;

	if(!descripcion, fecha_suceso) return res.status(400).json({ message : " Campo sin diligenciar, por favor, llene el campo " })

	try {
		const [rows] = await pool.query(
			"INSERT INTO reportes (id_usuarios, fecha_suceso, descripcion) VALUES (?, ?, ?)",
			[id_usuarios, fecha_suceso, descripcion]
		);

		res.status(200).send({
			id: rows.insertId,
			fecha_suceso,
			descripcion
		});
	} catch (error) {
		return res.status(500).json({
			error,
		});
	}
};

/* Eliminar un reporte */
export const deleteReporte = async (req, res) => {


	/* coger el id reporte del token que cree abajo y pasarlo aca para que lo elimine de la sesion actual */

	// const token = req.headers.authorization.split(' ')[1];
    // const tokenverify = jwt.verify(token, process.env.SECRET_KEY || 'Stigmata14');
    // const userId = tokenverify.id_usuarios

	const headerToken = req.headers['authorization']
    const tokenReportes = headerToken.slice(7);
    const tokenverify = jwt.verify(tokenReportes, process.env.REPORTES || 'Stigmata14');
    const reporteId = tokenverify.id_reportes

	try {
		const [result] = await pool.query(
			"DELETE FROM reportes WHERE id_reportes = ?",
			[reporteId]
		);

		if (result.affectedRows <= 0)
			return res
				.status(404)
				.json({ message: "El reporte no se encuentra creado" });
		res.status(204).json({
			message: "Reporte eliminado correctamente",
		});
	} catch (error) {
		return res.status(500).json({
			message: "Algo no ha ocurrido bien",
		});
	}
};

/* Actualizar un reporte */
export const putReporte = async (req, res) => {
	const { fecha_suceso, descripcion } = req.body;

	const headerToken = req.headers['authorization']
    const tokenReportes = headerToken.slice(7);
    const tokenverify = jwt.verify(tokenReportes, process.env.REPORTES || 'Stigmata14');
    const reporteId = tokenverify.id_reportes

	try {
		const [result] = await pool.query(
			"UPDATE reportes SET fecha_suceso = IFNULL(?, fecha_suceso), descripcion = IFNULL(?, descripcion) WHERE id_reportes = ?",
			[fecha_suceso, descripcion, reporteId]
		);

		if (result.affectedRows === 0)
			return res.status(404).json({
				message:
					"El reporte no ha sido eliminado debido a que no existe",
			});

		const [rows] = await pool.query(
			"SELECT * FROM reportes WHERE id_reportes = ?",
			[reporteId]
		);
		res.json(rows[0]);
	} catch (error) {
		return res.status(500).json({
			message: "Algo no ha ocurrido bien",
		});
	}
};

/* Ver el o los reporte por id de usuario */
export const getUserReporteId = async (req, res) => {

/* 	const token = req.headers.authorization.split(' ')[1];
    const tokenverify = jwt.verify(token, process.env.SECRET_KEY || 'Stigmata14');
    const userId = tokenverify.id_usuarios */

	const headerToken = req.headers['authorization']
    const token = headerToken.slice(7);
    const tokenverify = jwt.verify(token, process.env.SECRET_KEY || 'Stigmata14');
    const userId = tokenverify.id_usuarios

	try {
		const [rows] = await pool.query(
			"SELECT * FROM reportes WHERE id_usuarios = ?",
			[userId]
		);

		if (rows.length <= 0)
			return res.status(404).json({
				message: "NO tienes reportes creados, Crea uno en la informacion de tus vehiculos y podras visualizarlos aqui.",
			});
		res.status(200).json(rows);
	} catch (error) {
		return res.status(500).json({
			message: "Algo no ha ocurrido bien",
		});
	}
};

/* crear reporte con id logueado */
export const postReporte = async (req , res) => {
	const { fecha_suceso, descripcion } = req.body;

	if(!descripcion, !fecha_suceso) return res.status(400).json({ message : " Campo sin diligenciar, por favor, llene el campo " })

	const headerToken = req.headers['authorization']
    const token = headerToken.slice(7);
    const tokenverify = jwt.verify(token, process.env.SECRET_KEY || 'Stigmata14');
    const userId = tokenverify.id_usuarios

	try {
		const [rows] = await pool.query(
			"INSERT INTO reportes (id_usuarios, fecha_suceso, descripcion) VALUES (?, ?, ?)",
			[userId, fecha_suceso, descripcion]
		);

		const Payload = {
            id_reportes: rows.insertId,
            id_usuarios: userId,
            descripcion,
            fecha_suceso
        }

        const tokenReportes = jwt.sign(Payload, process.env.REPORTES || 'stigmata14')
        res.status(200).json(tokenReportes)
 
		// res.status(200).send({
		// 	id_reportes: rows.insertId,
		// 	id_usuarios: userId,
		// 	fecha_suceso,
		// 	descripcion
		// });
	} catch (error) {
		return res.status(500).json({
			error,
		});
	}
};