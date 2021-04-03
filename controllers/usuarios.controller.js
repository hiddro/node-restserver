const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');


const usuariosGet = async(req, res = response) => {

    // const query  = req.query;
    //limite
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    // const usuarios = await Usuario.find(query).
    //     skip(Number(desde)).
    //     limit(Number(limite)); 
    // const total = await Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).
            skip(Number(desde)).
            limit(Number(limite))
    ]);

    res.json({
        msg: "get API - Controlador",
        total,
        usuarios
    });
};

const usuariosPost = async(req, res) => {

    //extraer el body
    // const {nombre, edad} = req.body;
    const {nombre, correo, password, rol, edad, telefono, direccion} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol, edad, telefono, direccion});

    //verificar si existe el correo
    //se paso a db validators

    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardar en db
    await usuario.save();

    res.json({
        msg: "post API - Controlador",
        usuario
    });
};

const usuariosPut = async(req, res) => {

    const {id} = req.params;
    const {_id, password, google, correo, ...resto} = req.body;

    //TODO validar contra la base de datos
    if(password){
        //encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: "put API - Controlador",
        usuario
    });
};

const usuariosDelete = async(req, res) => {
    const {id} = req.params;

    //fisicamente lo borremos
    //no se recomienda hacer esto
    // const usuario = await Usuario.findByIdAndDelete(id);

    //esto es mejor al cambiar estado
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json({
        msg: "delete API - Controlador",
        usuario
    });
};

const usuariosPatch = (req, res) => {

    res.json({
        msg: "patch API - Controlador"
    });
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
}