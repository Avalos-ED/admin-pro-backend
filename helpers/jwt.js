const jwt = require('jsonwebtoken');

const generarJwt = ( uid ) => {

    return new Promise(( resolve, reject ) => {
        
        const payload = {
            uid
        };
    
        jwt.sign( payload, process.env.JWS_SECRET, {
            expiresIn: '12h'   
        }, (err, token ) => {
            if ( err ){
                console.log(err);
                reject('No se pudo generar el Token');
            } else {
                resolve( token );
            }
        });

    });

}

module.exports = {
    generarJwt
}
