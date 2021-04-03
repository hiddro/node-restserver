const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Conectar a Base de Datos
        this.conectarDB();

        //Middleware: funcion que se ejecuta cuando levantamos el Servidor
        //los midlewares siempre tienen el use adelante
        this.middlewares();
        //Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }
    
    middlewares(){

        //cors
        this.app.use(cors());

        //Lectura y parseo del body Postman /
        this.app.use(express.json());

        //directorio publico
        this.app.use(express.static('public'));
    }

    routes(){
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port)
        });
    }
}

module.exports = Server;


/*
de los routes 

this.app.get('/api', (req, res) => {
    res.json({
        msg: "get API"
    });
});

this.app.put('/api', (req, res) => {
    res.json({
        msg: "put API"
    });
});

this.app.post('/api', (req, res) => {
    res.json({
        msg: "post API"
    });
});

this.app.delete('/api', (req, res) => {
    res.json({
        msg: "delete API"
    });
});

this.app.patch('/api', (req, res) => {
    res.json({
        msg: "patch API"
    });
});

*/