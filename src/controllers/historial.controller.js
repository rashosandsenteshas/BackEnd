import { pool } from "../db.js";

export const getHistorial = async (req, res, next) => {

    // console.log(req.query);
    // const { fechaInicial, fechaFinal } = req.body;

    try {
        const [result] = await pool.execute(`
        SELECT u.nombre, v.placa, e.fecha_ingreso, e.fecha_salida FROM usuarios u JOIN vehiculos v ON u.id_usuarios = v.id_usuarios JOIN entrada_salida e ON v.id_vehiculo = e.id_vehiculo; 
        `);
        res.status(200).json(result)

    } catch (error) {
        res.status(400).json({message: "algo va mal, no se pudo obtener el historial"})
    }
}


export const getHistorialPorFechas = async (req, res, next) => {
    const { fecha_ingreso, fecha_salida } = req.body;
  
    try {
      const [result] = await pool.execute(
        `
        SELECT u.nombre, v.placa, e.fecha_ingreso, e.fecha_salida 
        FROM usuarios u 
        JOIN vehiculos v ON u.id_usuarios = v.id_usuarios 
        JOIN entrada_salida e ON v.id_vehiculo = e.id_vehiculo
        WHERE e.fecha_ingreso >= ? AND e.fecha_salida <= ?;
        `,
        [fecha_ingreso, fecha_salida]
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        message: "algo va mal, no se pudo obtener el historial",
      });
    }
  };