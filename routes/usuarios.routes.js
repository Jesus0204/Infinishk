const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const usuariosController = require('../controllers/usuarios.controller');