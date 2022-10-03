const { response } = require('express');
const jwt  = require('jsonwebtoken');

const validarJwt = (req, res = response, next) => {

    //Leer el Token
    const token = req.header('x-token');
    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.JWS_SECRET);
        req.uid = uid;
        
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok:false,
            msg: 'Token no valido'
        })
    }

}

module.exports = {
    validarJwt
}