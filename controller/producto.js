import { Producto } from "../models/producto.js"

async function getAll(req, res) {
    //find me devuelve todo
    // async await
    try {
        let productos = await Producto.find();
        res.status(200).json({ accion: 'get all', datos: productos })
            //si hubo un problema se lanza la excepción
    } catch (err) {
        res.status(500).json({ accion: 'get all', mensaje: 'error al obtener las productos' })
    }
}

async function insert(req, res) {
    const producto = new Producto(req.body)
    try {
        let productoGuardado = await producto.save();
        res.status(200).json({ accion: 'save', datos: productoGuardado })
    } catch (err) {
        res.status(500).json({ accion: 'save', mensaje: 'error al guardar la puntuacion' })
    }
}

async function remove(req, res) {
    //este es el id (xxxx) que insertamos
    let productoId = req.params.id;

    try {
        let productoBorrada = await Producto.findByIdAndDelete(productoId);
        res.status(200).json({ accion: 'delete', datos: productoBorrada })
    } catch (err) {
        res.status(500).json({ accion: 'delete', mensaje: 'error al borrar la puntuacion' })
    }
}

// actualizar una producto (PUT)
async function update(req, res) {
    var datos = req.body;
    let productoId = req.params.id;

    try {
        let productoActualizada = await Producto.findByIdAndUpdate(productoId, datos);
        res.status(200).json({ accion: 'update', datos: productoActualizada })
    } catch (err) {
        res.status(500).json({ accion: 'update', mensaje: 'error al actualizar la puntuacion' })
    }
}

export { getAll, remove, update, insert }