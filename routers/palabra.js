import express from 'express';

let router = express.Router();

import * as controller from '../controller/palabra.js';


router.get('/', controller.getAll)

router.post('/', controller.insert)

router.delete('/all', controller.removeAll)

router.delete('/:id', controller.remove)

export { router };