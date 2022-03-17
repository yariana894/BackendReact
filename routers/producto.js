import express from 'express';

let router = express.Router();

import * as controller from '../controller/producto.js';
import * as verify from '../middlewares/verifyToken.js';


/*5- Ampliar el sistema para que ademas de puntuaciones y usuarios se pueda gestionar productos
(insertar, listar, borrar y modificar)*/

// obtener todos las productos
// GET http://localhost:5300/producto/
router.get('/', controller.getAll)

// insertar una producto (POST)
//va a comprobar si el token es correcto
router.post('/', verify.auth, controller.insert)

// borrar una producto (DELETE)
router.delete('/:id', controller.remove)

// actualizar una producto (PUT)
router.put('/:id', controller.update)

export { router };