const express = require('express');
const multer = require('multer');
// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

//fileStorage: Es nuestra constante de configuración para manejar el almacenamiento
const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        //'uploads': Es el directorio del servidor donde se subirán los archivos 
        callback(null, 'uploads');
    },
    filename: (request, file, callback) => {
        //aquí configuramos el nombre que queremos que tenga el archivo en el servidor, 
        //para que no haya problema si se suben 2 archivos con el mismo nombre concatenamos el timestamp
        callback(null,Number(new Date()).toString() + file.originalname);
    },
});

router.use(multer({ storage: fileStorage }).single('archivo')); 

const pagosController = require('../controllers/pagos.controller');

router.get('/',pagosController.get_pago)
router.get('/registroTransferencia', pagosController.get_registro_transferencias);
router.post('/registroTransferencia', pagosController.post_subir_archivo);
router.post('/resultadoTransferencia', pagosController.post_registrar_transferencia);

module.exports = router;