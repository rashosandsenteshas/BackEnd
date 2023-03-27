// imports
import express from 'express';
import cors from 'cors';
import bcryptsjs from 'bcryptjs';
import bodyParser from 'body-parser'

// imported routes
import usuariosRoutes from './routes/usuarios.routes.js';
import vehiculosRoutes from './routes/vehiculos.routes.js';
import reportesRoutes from './routes/reportes.routes.js';
import entrada_salidaRoutes from './routes/entrada_salida.routes.js';
import aseguradoraRoutes from './routes/aseguradora.routes.js';
import facturaRoutes from './routes/factura.routes.js';
import authRoutes from './routes/auth.routes.js';
import historialRoutes from './routes/historial.routes.js';
import enviaremailRoutes from './routes/enviaremail.routes.js';
import indexRoutes from './routes/index.routes.js';


/* module initialization */
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.json());

// Endpoints

app.use('/', indexRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', vehiculosRoutes);
app.use('/api', reportesRoutes);
app.use('/api', entrada_salidaRoutes);
app.use('/api', aseguradoraRoutes);
app.use('/api', facturaRoutes);
app.use('/api', historialRoutes);
app.use('/api', enviaremailRoutes);
app.use('/api/auth/', authRoutes);

app.use((req, res, next) => {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0); 
    res.status(404).json({
        message: 'ENDPOINT NO ENCONTRADA',
    });
});

export default app;
