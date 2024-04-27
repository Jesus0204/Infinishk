// Para usar express en vez de http
const express = require('express');

// Inicia la app usuando a express
const app = express();

// Configuramos a EJS como motor de templates con express
app.set('view engine', 'ejs');
app.set('views', 'views');

const path = require('path');

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

const multer = require('multer');
const upload = multer(); // Utiliza multer sin configuración de almacenamiento

app.use(upload.single('archivo')); // Utiliza la configuración de multer sin almacenamiento
// Para proteger del Cross-Site Request Forgery
const csrf = require('csurf');
const csrfProtection = csrf();

//...Y después del código para inicializar la sesión... 
app.use(csrfProtection);

const helmet = require("helmet");

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "script-src": ["'self'", 'code.jquery.com', 'ajax.googleapis.com', 'cdn.jsdelivr.net'],
            "script-src-attr": ["'unsafe-inline'"]
        },
    },
}));

const compression = require("compression");

app.use(compression());

const rutasSession = require('./routes/session.routes');
app.use('/auth', rutasSession);

app.use(bodyParser.json());

const rutasDiplomado = require('./routes/diplomado.routes');
app.use('/diplomado', rutasDiplomado);

const rutasConfiguracion = require('./routes/configuracion.routes');
app.use('/configuracion', rutasConfiguracion);

const rutasPago = require('./routes/pagos.routes');
app.use('/pagos', rutasPago);

// Agregar funcion para iterar la lista del ejs, y que el codigo se vea limpio
app.locals.contienePermiso = (permisos, casoUso) => {

    const contains = !!permisos.find(caso => {
        return caso.funcion === casoUso;
    })

    return contains;
};

const scheduleController = require('./controllers/schedule.controller');

const cron = require('node-cron');

cron.schedule('0 3 * * *', () => {
    scheduleController.set_recargos();
}, {
    scheduled: true,
    timezone: "America/Mexico_City"
});

cron.schedule('0 9 * * *', () => {
    scheduleController.enviarCorreoRecordatorio();
}, {
    scheduled: true,
    timezone: "America/Mexico_City"
});

cron.schedule('0 9 * * *', () => {
    scheduleController.enviarCorreoAtrasado();
}, {
    scheduled: true,
    timezone: "America/Mexico_City"
});

//Para error 404
app.use((request, response, next) => {
    response.status(404);
    response.render('404', {
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    });
});

// Para que el servidor este activo
app.listen(process.env.PORT || 4000);