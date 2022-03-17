import express from 'express';
var router = express.Router();

import * as controller from '../controller/usuario.js';

//cuando queremos leer algo utilizamos un get
//cuando colocamos algo utilizamos un post

// obtener todos los usuarios
router.get('/',  controller.getAll)
// obtener un usuario por su id
router.get('/:id', controller.getById)
// Inserta un usuario nuevo
router.post('/register', controller.register)
// Realizamos el login en la base de dtos
router.post('/login', controller.login)
// Borra un ususario
router.delete('/:id', controller.remove)
// Actualiza los dtos de un usuario
router.put('/:id', controller.update)

// Muestra las puntuaciones de un usuario en particular
router.get('/:id/puntuacion', controller.getPuntuacionesUsuario)
// Inserta una puntuación a un ususario en particular
router.post('/:id/puntuacion', controller.insertPuntuacion)



export { router };