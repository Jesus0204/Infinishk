const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const usuariosController = require('../controllers/usuarios.controller');

// Incluyes el archivo para verificar si esta autenticado y los permisos
const isAuth = require('../util/is-Auth');
const can_AlumnosAtrasados = require('../util/privileges/admin/consultas/can_Alumnos_atrasados');
const can_ConsultarUsuario = require('../util/privileges/admin/consultas/can_consultar_Usuario');
const can_ConsultarAlumno = require('../util/privileges/can_consultar_alumno');
const can_ConsultarHorarioAlumno = require('../util/privileges/can_consultar_HorarioAlumno');
const can_RegistrarRol= require('../util/privileges/admin/registros/can_registrar_Rol');
const can_RegistrarUsuario = require('../util/privileges/admin/registros/can_registrar_usuario');
