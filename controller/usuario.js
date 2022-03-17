import { Usuario } from '../models/usuario.js';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { Puntuacion } from "../models/puntuacion.js";

/*exactamente igual que en las puntuaciones*/
async function getAll(req, res) {
    try {
        let usuarios = await Usuario.find();
        res.status(200).json({ accion: 'get all', datos: usuarios })
    } catch (err) {
        res.status(500).json({ accion: 'get all', mensaje: 'error al obtener los usuarios' })
    }
}

//obtiene un usuario en particular
async function getById(req, res) {
    let usuarioId = req.params.id;

    try {
        let usuario = await Usuario.findById(usuarioId);
        res.status(200).json({ accion: 'get one', datos: usuario })
    } catch (err) {
        res.status(500).json({ accion: 'get one', mensaje: 'error al obtener el usuario' })
    }
}

async function remove(req, res) {
    let usuarioId = req.params.id;
    try {
        let usuarioBorrado = await Usuario.findByIdAndDelete(usuarioId);
        res.status(200).json({ accion: 'delete', datos: usuarioBorrado })
    } catch (err) {
        res.status(500).json({ accion: 'delete', mensaje: 'error al borrar el usuario' })
    }

}

async function update(req, res) {
    let datos = req.body;
    let usuarioId = req.params.id;

    try {
        let usuarioActualizado = await Usuario.findByIdAndUpdate(usuarioId, datos);
        res.status(200).json({ accion: 'update', datos: usuarioActualizado })
    } catch (err) {
        res.status(500).json({ accion: 'update', mensaje: 'error al actualizar el usuario' })
    }
}


//joi es un módulo que nos permite validar cosas
const schemaLogin = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['es', 'com', 'net'] } }).required(),
    //la constraseña tiene que ser de 3-30 caracteres y pueden haber números y letras
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})

// va a ser así siempre
async function login(req, res) {
    // Validamos los campos
    try {
        //me llegan los datos por el body me llega por post
        //validamos con joi la información que llega por body
        const { error, value } = await schemaLogin.validateAsync(req.body)
    } catch (err) {
        return res.status(400).json({ accion: 'save', mensaje: 'error al validar el login' + err })
    }

    // Comprobar que el usuario si existe
    let usuarioExistente = await Usuario.findOne({ email: req.body.email })
    if (!usuarioExistente) return res.status(400).json({
        accion: 'save',
        mensaje: 'Error en el usuario/password (pista: el usuario no existe).'
    })

    // Comprobamos si el password coincide
    //utilizamos la librería bcrypt para encryptar la constraseña porque está encriptado
    /*usuarioExistente.password es el que está encriptado no podría hacer una comparación con ==
    tenemos que usar la librería bcrypt.compare(datos formulario, password encriptado en la base de datos)*/
    const passwordValido = await bcrypt.compare(req.body.password, usuarioExistente.password)
    if (!passwordValido) return res.status(400).json({ accion: 'save', mensaje: 'Error en el usuario/password' })

    // Creamos el token jwt (jsonwebtoken)  Ver web: https://jwt.io/
    //json web token
    const token = jwt.sign({
            //parámetros del token
            _id: usuarioExistente._id,
            chiste: '¿Cuál es el último animal que subió al arca de Noé? El del-fin.',
            //fecha de expiración
            exp: Math.floor(Date.now() / 1000) + (60 * 60), //1 hora
            email: usuarioExistente.email,
            nombre: usuarioExistente.nombre,
            //exp: exp: moment().add(20, "seconds").unix()
        },
        //el token_secreto está en el .env que creamos en la raiz del proyecto
        process.env.TOKEN_SECRETO)
    res.header('auth-token', token)

    res.status(200).send({ token })
}

// caracteristicas para el register
const schemaRegister = Joi.object({
    nombre: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['es', 'com', 'net'] } }),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),

    repeat_password: Joi.ref('password'),
})

async function register(req, res) {
    // Validamos los campos
    /* try {
         const { error, value } = await schemaRegister.validateAsync(req.body)
         console.log(value)
         console.log(error)
     }
     catch (err) {
         return res.status(400).json({accion:'save', mensaje:'error al guardar el usuario'+err})
     }*/

    // Comprobar que el usuario no existe antes
    try {
        let usuarioExistente = await Usuario.findOne({ email: req.body.email })
        if (usuarioExistente) return res.status(400).json({
            accion: 'save',
            mensaje: 'Error en el usuario/password (pista: ya existe el user).'
        })
    } catch (err) {
        return res.status(400).json({ accion: 'save', mensaje: 'Error en el usuario/password' + err })
    }

    // Creamos el hash del password (nunca debemos guardar el password en texto claro)
    //encriptamos el password
    const salt = await bcrypt.genSalt(10)
        //pasamos de texto a password encriptado
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const usuario = new Usuario(req.body)
    usuario.puntuaciones = []
    usuario.password = hashPassword

    try {
        //guardamos el password en la base de datos
        let usuarioGuardado = await usuario.save();
        res.status(200).json({ accion: 'save', datos: usuarioGuardado })
    } catch (err) {
        res.status(500).json({ accion: 'save', mensaje: 'error al guardar el usuario' })
    }
}

// Ojo con populate

async function getPuntuacionesUsuario(req, res) {
    //quiero saber el id del usuario que queremos saber las puntuaciones
    let usuarioId = req.params.id;

    try {
        //consigo que me devuelva el array de las puntuaciones de ese usuario con el .populate
        let usuario = await Usuario.findById(usuarioId).populate('puntuaciones');
        res.status(200).json({ accion: 'get one', datos: usuario })
    } catch (err) {
        res.status(500).json({ accion: 'get one', mensaje: 'error al obtener el usuario' })
    }
}

async function insertPuntuacion(req, res) {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        //todas estas consultas entre el start y el commit se van a ejecutar
        //sino se ejecuta una no se ejecuta ninguna
        let usuarioId = req.params.id;
        // Buscamos el usuario
        let usuarioBuscado = await Usuario.findById(usuarioId);
        // Creamos una nueva puntuacion (con el body)
        let puntuacionNueva = new Puntuacion(req.body)
            // asignamos la puntuacion al usuairo
            // puntuacionNueva.usuario = usuarioBuscado;
            // Guardamos la puntuacion
        let puntuacionGuardada = await puntuacionNueva.save();
        // colocamos la puntuación dentro del usuario
        usuarioBuscado.puntuaciones.push(puntuacionGuardada)
            // Guardamos el usuario
        let usuarioGuardado = await usuarioBuscado.save();

        await session.commitTransaction();
        //session.endSession();

        res.status(200).json({ accion: 'save', datos: usuarioGuardado })
    } catch (err) {
        console.log(err)
        await session.abortTransaction();
        res.status(500).json({ accion: 'save', mensaje: 'error al guardar la puntuacion en el usuario' + err })
    } finally {
        session.endSession();
    }
}

export { getAll, getById, login, register, update, remove, insertPuntuacion, getPuntuacionesUsuario, }