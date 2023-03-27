import { pool } from '../db.js';
import twilio from 'twilio'
import bcrypt from "bcryptjs"
// import { createInterface } from "readline";


const accountSid = 'AC537d64f60e16b65c5b83f4dde57b8718'; // Tu clave API de Twilio
const authToken = 'e25609c019d83fe4dc7adf739a62a2e4'; // Tu token de autenticación de Twilio
const client = new twilio(accountSid, authToken);
const verifySid = "VAad4cc083d35c6277868f44e0e1b7d6c9";

let numero
let codigo

export const sendCode = async (req, res, next) => {
    numero = req.body.numero
    // const codigo = req.body.numero

    if (!numero) {
      return res.status(400).json({ message: "Numero de telefono requerido" });
    }
  
    client.verify.v2
    .services(verifySid)
    .verifications.create({ to: `+57${numero}`, channel: "sms", friendlyName: 'es: ' })
    res.status(200).json({message: "Codigo enviado correctamente"})
}

export const verifyCode = async (req, res, next) => {
    codigo = req.body.codigo;
    
    if (!codigo) {
        return res.status(400).json({ message: "Código de confirmación requeridos" });
    }

    client.verify.v2
    .services(verifySid)
    .verificationChecks.create({ to: `+57${numero}`, code: codigo })
    .then((verification_check) => {
      console.log(verification_check.status);
      if (verification_check.status === 'approved') {
        res.status(200).json({ message: "Código de verificación aprobado" });
      } else {
        res.status(400).json({ message: "Código de verificación incorrecto" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ message: error.message });
    });
}

export const actualizarPassword = async (req, res, next) => {
    const { contrasena, correo } = req.body

    let passHash = await bcrypt.hash(contrasena, 10);

    const [userExists] = await pool.query('SELECT * FROM usuarios WHERE correo = ?',[correo]);
	if (userExists >= [0]){
        // console.log(userExists);
        const pass = userExists[0].id_usuarios
        if (!contrasena) return res.status(400).json({ message: "Debe de ingresar una contraseña." });

        const [result] = await pool.query("UPDATE usuarios SET contrasena = ? WHERE id_usuarios = ?", [passHash, pass]);

		if (result.affectedRows === 0)
			return res.status(404).json({message: "No se puede actualizar ya que el usuario no existe.",});

		const [rows] = await pool.query("SELECT * FROM usuarios WHERE id_usuarios = ?",[pass]);
		res.json(rows[0]);

        console.log("funciona");
    }else {
        return res.status(400).json({ message: 'Este correo no esta asociado en nuestra aplicacion, por favor, digita el correo de tu cuenta para poder cambiar la contraseña.' });
    }
}