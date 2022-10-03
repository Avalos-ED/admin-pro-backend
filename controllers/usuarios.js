const { response, json } = require('express');
const abcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJwt } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {
    const usuarios = await Usuario.find();
    
    res.json({
        ok: true,
        usuarios
    });
}

const crearUsuarios = async(req, res = response) => {
    const { email, password, nombre } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });

        if(existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El email ya esta registrado'
            });
        }

        const usuario = new Usuario(req.body);
        //Encriptando contraseña
        const salt = abcrypt.genSaltSync();
        usuario.password = abcrypt.hashSync(password, salt);
        await usuario.save();

        //Genrar un TOKEN con JWT
        const token = await generarJwt( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...revisar logs'
        })
    }

    
}

const actualizarUsuarios = async(req, res = response) => {
    // TODO: Validar Token y comprabar si es el usuario correcto
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe en la DB'
            })
        }

        //Actualizaciones
        const {password, google, email, ...campos} = req.body;
        if ( usuarioDB.email !== email ) {
            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuarion con ese email'
                }) 
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true });
        usuarioActualizado.save();

        res.json({
            ok: true,
            usuario: usuarioActualizado,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarUsuario = async(req, res = response) => {
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese Id'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok: true,
            msg: 'Usuario Eliminado'
        })   
    } catch (error) {
        console.log(error)
        json.status(500).json({
            ok: false,
            msg: 'Ocurrio un error contacte al administrador'
        })
    }

}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuarios,
    borrarUsuario
}