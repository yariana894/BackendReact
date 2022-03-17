import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as routerPuntuacion } from './routers/puntuacion.js';
import { router as routerUsuario } from './routers/usuario.js';
import { router as routerProducto } from './routers/producto.js';
import { router as routerPalabra } from './routers/palabra.js';

/*esto es lo mismo copiar pegar*/
dotenv.config();
let app = express();
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
    //cada vez que un cliente me envia datos me aparece en pantalla
app.use(morgan('dev'))

/*RUTAS*/
app.use('/puntuacion', routerPuntuacion)
app.use('/usuario', routerUsuario)
app.use('/producto', routerProducto)
app.use('/palabra', routerPalabra)


app.get('/', (req, res) => {
    res.send('Bienvenido a nuestro backend')
})

const run = async() => {
    await mongoose.connect(process.env.URL_BASEDATOS, { useNewUrlParser: true, useUnifiedTopology: true })
    await app.listen(process.env.PUERTO_SERVIDOR)
    console.log("Servidor y base de datos arrancados")
}

run().catch(err => console.log('Fallo al arrancar:' + err))
    /*hasta aquí*/