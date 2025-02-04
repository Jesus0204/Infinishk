// Para usar express en vez de http
const express = require('express');

// Inicia la app usuando a express
const app = express();

// Configuramos a EJS como motor de templates con express
app.set('view engine', 'ejs');
app.set('views', 'views');

const path = require('path');

// Para que se puede usar cookie parser de forma mas facil
const cookieParser = require('cookie-parser');
app.use(cookieParser('Un secreto'));

// Para usar las sesiones
const session = require('express-session');

app.use(session({
    secret: 's&xYnn9oVRuo3*0@sBA&SedkdMGoM!&e%kASzFfZ6537MqWruvYe27X=7hQUdktRRxYQHDjWtW7veznF',
    resave: false, //La sesión no se guardará en cada petición, sino sólo se guardará si algo cambió 
    saveUninitialized: false, //Asegura que no se guarde una sesión para una petición que no lo necesita
    rolling: true, // Renueva la sesión en cada interacción del usuario
    cookie: {
        maxAge: 900000 // Tiempo en milisegundos para que expire la sesión
    }
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

const helmet = require('helmet');

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "script-src": ["'self'", 'code.jquery.com', 'ajax.googleapis.com', 'cdn.jsdelivr.net', 'cdnjs.cloudflare.com'],
            "script-src-attr": ["'unsafe-inline'"], 
            "connect-src": ["'self'", `${process.env.PAGO_URL}`],
            "frame-src": ['*']
        },
    },
}));

const compression = require('compression');

app.use(compression());

// Para utilizar chartist para la generación de gráficos
const chartist = require('chartist');

const rutasSession = require('./routes/session.routes');
app.use('/auth', rutasSession);

app.use(bodyParser.json());

const rutasDiplomado = require('./routes/diplomado.routes');
app.use('/diplomado', checkSession, rutasDiplomado);

const rutasConfiguracion = require('./routes/configuracion.routes');
app.use('/configuracion', checkSession, rutasConfiguracion);

const rutasPago = require('./routes/pagos.routes');
app.use('/pagos', checkSession, rutasPago);

const rutasHorario = require('./routes/horario.routes');
app.use('/horario', checkSession, rutasHorario);

const rutasAlumno = require('./routes/alumnos.routes');
app.use('/alumnos', checkSession, rutasAlumno);

const rutasEstadoCuenta = require('./routes/estadocuenta.routes');
app.use('/estado_cuenta', checkSession, rutasEstadoCuenta);

// Middleware para verificar si la sesión está activa
function checkSession(req, res, next) {
    if (!req.session.username) {
        // Redirigir al login si no hay una sesión activa
        return res.redirect('/auth/login');
    }
    next();
}

// Middleware para manejar errores de CSRF
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        // Redirigir al login cuando se detecte un token CSRF inválido
        return res.redirect('/auth/login');
    }
    next(err);
});

// Agregar funcion para iterar la lista del ejs, y que el codigo se vea limpio
app.locals.contienePermiso = (permisos, casoUso) => {
    const contains = !!permisos.find(caso => {
        return caso.funcion === casoUso;
    });
    return contains;
};

let moment = require('moment-timezone');
moment.locale('es-mx');
app.locals.moment = moment;

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

// cron.schedule('0 9 * * *', () => {
//     scheduleController.enviarCorreoAtrasado();
// }, {
//     scheduled: true,
//     timezone: "America/Mexico_City"
// });

cron.schedule('0 4 20 Jan,Jul *', () => {
    scheduleController.aceptar_horario_resagados();
}, {
    scheduled: true,
    timezone: "America/Mexico_City"
});

const home_root = require('./util/home');
app.get('/', home_root);

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
