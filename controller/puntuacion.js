import { Puntuacion } from '../models/puntuacion.js';
import Joi from "joi";

/*=============DEVUELVE TODAS LAS PUNTUACIONES =========*/

const schemaInsert = Joi.object({
    puntuacion: Joi.number()
        .integer()
        .min(0)
        .max(5)
        .required(),
    date: Joi.date()

})

// localhost:5300/puntuacion/
/*async function getAll(req, res) {
    //find me devuelve todo
    // async await
    try {
        let puntuaciones = await Puntuacion.find();
        res.status(200).json({ accion: 'get all', datos: puntuaciones })
            //si hubo un problema se lanza la excepción
    } catch (err) {
        res.status(500).json({ accion: 'get all', mensaje: 'error al obtener las puntuaciones' })
    }*/
//callbacks
/* Puntuacion.find({}).exec( (err, puntuaciones)=>{
     if(err){
         res.status(500).send({accion:'get all', mensaje:'error al obtener la puntuacion'})
     }else{
         res.status(200).send({accion:'get all', datos: puntuaciones})
     }
 })*/
// promesas
/*Puntuacion.find().exec()
    .then(puntuaciones => res.status(200).send({accion:'get all', datos: puntuaciones}) )
    .catch(err => res.status(500).send({accion:'get all', mensaje:'error al obtener la puntuacion'}) )
*/
//}

async function getAll(req, res) {
    if (req.query.mayor) {
        try { // si me han pasado parametros en la query
            let puntuaciones = await Puntuacion.find({ puntuacion: { $gt: req.query.mayor } });
            res.status(200).json({ accion: 'get mayor que', datos: puntuaciones })
        } catch (err) {
            res.status(500).json({ accion: 'get mayor que', mensaje: 'error al obtener las puntuaciones mayor a un valor dado' })
        }
    } else { // no me han pasado parametros en la query
        try {
            let puntuaciones = await Puntuacion.find();
            res.status(200).json({ accion: 'get all', datos: puntuaciones })
        } catch (err) {
            res.status(500).json({ accion: 'get all', mensaje: 'error al obtener las puntuaciones' })
        }
    }
}

/*==========DEVUELVE UNA PUNTUACIÓN EN CONCRETO INSERTANDO ID======*/

//localhost:5300/puntuacion/xxxx
//me permite recoger un dato en particular - req.params.id
//este método siempre es así COPIAR-PEGAR
async function getById(req, res) {
    let puntuacionId = req.params.id;

    try {

        //ahora solo me devuelve una puntuación en particular
        let puntuacion = await Puntuacion.findById(puntuacionId);
        res.status(200).json({ accion: 'get one', datos: puntuacion })
    } catch (err) {
        res.status(500).json({ accion: 'get one', mensaje: 'error al obtener la puntuacion' })
    }
}


/*==========INSERTA UNA PUNTUACIÓN==========*/
// localhost:5300/puntuacion/ -->por POST
/*los datos de la puntuación que tengo que insertar están en el body
 * -fecha, valor de puntuacion, usuario..*/
//los datos me llegan por el body
//este método siempre es así COPIAR-PEGAR
async function insert(req, res) {
    const puntuacion = new Puntuacion(req.body)
        /* var datos = req.body;
         var puntuacion = new Puntuacion();
         puntuacion.nombre = datos.nombre;
         puntuacion.puntuacion = datos.puntuacion;*/

    try {
        const { error, value } = await schemaInsert.validateAsync(req.body)
    } catch (err) {
        return res.status(400).json({ accion: 'save', mensaje: 'error al validar el login: ' + err })
    }


    try {
        //guardamos los datos en la base de datos
        let puntuacionGuardada = await puntuacion.save();
        res.status(200).json({ accion: 'save', datos: puntuacionGuardada })
    } catch (err) {
        res.status(500).json({ accion: 'save', mensaje: 'error al guardar la puntuacion' })
    }
}

/*==========BORRAR UNA PUNTUACIÓN==========*/
// localhost:5300/puntuacion/xxxx -->por DELETE
//este método siempre es así COPIAR-PEGAR
async function remove(req, res) {
    //este es el id (xxxx) que insertamos
    let puntuacionId = req.params.id;

    try {
        let puntuacionBorrada = await Puntuacion.findByIdAndDelete(puntuacionId);
        res.status(200).json({ accion: 'delete', datos: puntuacionBorrada })
    } catch (err) {
        res.status(500).json({ accion: 'delete', mensaje: 'error al borrar la puntuacion' })
    }
}

// actualizar una puntuacion (PUT)
//este método siempre es así COPIAR-PEGAR
async function update(req, res) {
    //nueva informacion que voy a guardar
    var datos = req.body;
    //la información que voy a actualizar
    let puntuacionId = req.params.id;

    try {
        let puntuacionActualizada = await Puntuacion.findByIdAndUpdate(puntuacionId, datos);
        res.status(200).json({ accion: 'update', datos: puntuacionActualizada })
    } catch (err) {
        res.status(500).json({ accion: 'update', mensaje: 'error al actualizar la puntuacion' })
    }
}

/*localhost:5300/puntuacion/cero*/

/*está mal=========================*/
async function getAllcero(req, res) {
    try {
        let puntuaciones = await Puntuacion.find({ puntuacion: 0 });
        res.status(200).json({ accion: 'get value cero', datos: puntuaciones })
            //si hubo un problema se lanza la excepción
    } catch (err) {
        res.status(500).json({ accion: 'get all', mensaje: 'error al obtener las puntuaciones' })
    }
}

/*FUNCIONA*/
async function removeAll(req, res) {
    try {
        let puntuacionBorrada = await Puntuacion.deleteMany();
        res.status(200).json({ accion: 'delete', datos: puntuacionBorrada })
    } catch (err) {
        res.status(500).json({ accion: 'delete', mensaje: 'error al borrar la puntuacion' })
    }
}


export { getAll, getById, insert, remove, update, getAllcero, removeAll }