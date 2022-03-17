//const jwt = require('jsonwebtoken')
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    //coge el token por el header
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Acceso denegado')

    try {
        console.log(token)
        console.log(process.env.TOKEN_SECRETO)
        //verificamos si ese token a través jwt es correcto o incorrecto
        const verificado = jwt.verify(token, process.env.TOKEN_SECRETO)
        req.user = verificado
        console.log(verificado)
    } catch (err) {
        return res.status(400).send('Token invalido: ' + err)
    }
    next();
}

export {auth}