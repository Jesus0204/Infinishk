// Para usar express en vez de http
const express = require('express');

// Inicia la app usuando a express
const app = express();

// Configuras a EJS como motor de templates con express
app.set('view engine', 'ejs');
app.set('views', 'views');

const path = require('path');

const bcrypt = require('bcryptjs');

// Para que se puede usar cookie parser de forma mas facil
const cookieParser = require('cookie-parser')
app.use(cookieParser('Un secreto'))

// Para usar las sesiones
const session = require('express-session');

app.use(session({
    secret: 'mi string secreto que debe ser un string aleatorio muy largo, no como éste',
    resave: false, //La sesión no se guardará en cada petición, sino sólo se guardará si algo cambió 
    saveUninitialized: false, //Asegura que no se guarde una sesión para una petición que no lo necesita
}));

// La aplicacion va a tener acceso a todo lo que esta en public
app.use(express.static(path.join(__dirname, 'public')));

// Manipular facil los datos de las peticiones
const bodyParser = require('body-parser');

// Configura bodyparser
app.use(bodyParser.urlencoded({
    extended: false
}));

const rutasDiplomado = require('./routes/diplomado.routes');
app.use('/diplomado', rutasDiplomado);

const rutasConfiguracion = require('./routes/configuracion.routes');
app.use('/configuracion', rutasConfiguracion);

const rutasPago = require('./routes/pagos.routes');
app.use('/pagos', rutasPago);

const rutasAlumnos = require('./routes/alumnos.routes');
app.use('/alumnos', rutasAlumnos);
const rutasAdmin = require('./routes/administrador.routes');
app.use('/administrador', rutasAdmin);
const rutasVisualizador = require('./routes/visualizador.routes');
app.use('/visualizador', rutasVisualizador);


//Para error 404
app.use((request, response) => {
    response.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// Para que el servidor este activo
app.listen(4000);