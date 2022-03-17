import Joi from "joi";
import { Palabra } from '../models/palabra.js';


async function getAll(req, res) {
    //find me devuelve todo
    // async await
    try {
        let palabras = await Palabra.find();
        res.status(200).json({ accion: 'get all', datos: palabras })
            //si hubo un problema se lanza la excepción
    } catch (err) {
        res.status(500).json({ accion: 'get all', mensaje: 'error al obtener las palabras' })
    }
}

async function insert(req, res) {
    const palabra = new Palabra(req.body)

    let palabraExistente = await Palabra.findOne({ palabra: req.body.palabra })
    if (palabraExistente) return res.status(400).json({
        accion: 'save',
        mensaje: 'Error en la palabra está repetida.'
    })

    try {
        let palabraGuardada = await palabra.save();
        res.status(200).json({ accion: 'save', datos: palabraGuardada })
    } catch (err) {
        res.status(500).json({ accion: 'save', mensaje: 'error al guardar la palabra' })
    }
}

async function removeAll(req, res) {
    try {
        let palabrasBorrada = await Palabra.deleteMany();
        res.status(200).json({ accion: 'delete', datos: palabrasBorrada })
    } catch (err) {
        res.status(500).json({ accion: 'delete', mensaje: 'error al borrar la palabra' })
    }
}

async function remove(req, res) {
    //este es el id (xxxx) que insertamos
    let palabraId = req.params.id;

    try {
        let palabraBorrada = await Palabra.findByIdAndDelete(palabraId);
        res.status(200).json({ accion: 'delete', datos: palabraBorrada })
    } catch (err) {
        res.status(500).json({ accion: 'delete', mensaje: 'error al borrar la palabra' })
    }
}

export { getAll, insert, removeAll, remove }