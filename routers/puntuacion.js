import express from 'express';

let router = express.Router();

import * as controller from '../controller/puntuacion.js';
import * as verify from '../middlewares/verifyToken.js';

// CRUD (Create, Read, Update, Delete)

// obtener todos las puntuciones
// GET http://localhost:5300/puntuacion/
/*router.get('/', controller.getAll)*/

/*9- Ahora en tu backend se necesita un endpoint que permita buscar puntuaciones con valor mayor a un dato pasado en la query de la URL.*/
router.get('/', controller.getAll)

// obtener una puntuacion por id
// GET http://localhost:5300/puntuacion/5e9f8f8f8f8f8f8f8f8f8f8
router.get('/:id', controller.getById)

// insertar una puntuacion (POST)
//va a comprobar si el token es correcto
router.post('/', verify.auth, controller.insert)

// borrar una puntuacion (DELETE)
router.delete('/:id', controller.remove)

// actualizar una puntuacion (PUT)
router.put('/:id', controller.update)

/*3- Se necesita que tu backend tenga un endpoint que permita listar todas las puntuaciones con valor 0*/
router.get('/puntuacionesCero', controller.getAllcero)

/*4- Se necesita un endpoint que permita borrar todas las puntuaciones de una vez.
A este endpoint solo se podrá acceder si estás logueado*/
router.delete('/all', controller.removeAll)




export { router };

// localhost:5300/puntuacion/   <-- obtener todas las puntuaciones
// localhost:5300/puntuacion/xxxx <--obtener una puntuación en particular -- tipo de petición get(siempre que usamos en navegador)
// DELETE localhost:5300/puntuacion/xxxx <-- borrar una puntuación en particular