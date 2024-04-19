
function updateLabel() {
    var archivo = document.getElementById('archivo');
    var label = document.getElementById('labelArchivo');
    label.innerHTML = '<i class="fas fa-upload"></i> ' + archivo.files[0].name;
}
function validateFile() {
    var archivo = document.getElementById('archivo');
    var error = document.getElementById('error');
    if (archivo.files.length === 0) {
        error.textContent = 'Por favor ingresa un archivo';
        return false;
    }
    var file = archivo.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var content = e.target.result;
        // Aquí deberías agregar la lógica para validar el contenido del CSV
        // Por ejemplo, verificar que las columnas necesarias estén presentes
        if (csvContentIsValid(content)) {
            // Si el contenido es válido, permitir la carga del archivo
            document.forms[0].submit(); // Esto enviará el formulario
        } else {
            error.textContent = 'Por favor ingresa un csv válido.';
        }
    };
    reader.onerror = function () {
        error.textContent = 'Hubo un error al leer el archivo';
    };
    reader.readAsText(file);
    return false; // Esto detiene la carga hasta que la validación sea exitosa
}

function csvContentIsValid(csvContent) {
    // Implementa la lógica para validar el contenido del CSV aquí
    // Esta es solo una estructura básica, necesitarás adaptarla a tus necesidades
    var lines = csvContent.split('\n');
    if (lines.length > 1) {
        var headers = lines[0].split(',');
        // Verifica que las cabeceras necesarias estén presentes
        if (headers.indexOf('Fecha') > -1 && headers.indexOf('Hora') > -1) {
            // Añade más validaciones según sea necesario
            return true;
        }
    }
    return false;
}


// Inicialmente ocultar la tabla de Pagos No Completos
document.getElementById('tablaNoCompleta').style.display = 'none';

// Agregar un evento de click al botón
document.getElementById('toggleButton').addEventListener('click', function () {
    // Comprobar si la tabla de Pago Completo está visible
    var isTablaCompletaVisible = document.getElementById('tablaCompleta').style.display !== 'none';
    console.log(isTablaCompletaVisible);
    // Cambiar la visibilidad de las tablas
    document.getElementById('tablaCompleta').style.display = isTablaCompletaVisible ? 'none' : 'block';
    document.getElementById('tablaNoCompleta').style.display = isTablaCompletaVisible ? 'block' : 'none';
});

document.getElementById('toggleButtonActivo').addEventListener('click', function () {
    // Comprobar si la tabla de Pago Completo está visible
    var isTablaCompletaVisible = document.getElementById('tablaCompleta').style.display !== 'none';
    console.log(isTablaCompletaVisible);
    // Cambiar la visibilidad de las tablas
    document.getElementById('tablaCompleta').style.display = isTablaCompletaVisible ? 'none' : 'block';
    document.getElementById('tablaNoCompleta').style.display = isTablaCompletaVisible ? 'block' : 'none';
});



document.querySelectorAll('.form-enviar-datos select[name="tipoPago"]').forEach((select) => {
    select.addEventListener('change', (event) => {
        // Obtener el elemento tr ancestro más cercano del select
        const fila = select.closest('tr');
        // Asegurarse de que se encontró una fila
        if (fila) {
            // Actualizar la clase de la fila basada en el valor seleccionado
            fila.className = event.target.value.replace(/\s/g, '-');
        } else {
            console.error('No se encontró la fila correspondiente al select.');
        }
    });
});

document.querySelectorAll('.form-enviar-datos').forEach((form, index) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        fetch('/pagos/resultadoTransferencia', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json()) // Convertir la respuesta a JSON
            .then(data => {
                if (!data.success) {
                    // Manejar el caso en que success no es true
                    console.error('La operación no fue exitosa:', data);
                    // Aquí puedes agregar código para mostrar un mensaje de error al usuario
                    alert('Por favor verifica tu tipo de pago');
                } else {
                    // Si la respuesta fue exitosa, eliminar la fila de la tabla
                    const filaId = form.parentElement.parentElement.id;
                    const fila = document.getElementById(filaId);
                    if (fila) {
                        fila.remove();
                    } else {
                        console.error(`No se encontró la fila ${filaId}.`);
                    }
                }
            })
            .catch(error => {
                console.error('Error en la petición fetch:', error);
                alert('Por favor verifica tu tipo de pago.');
            });
    });
});

document.querySelectorAll('.form-enviar-datos select[name="tipoPago"]').forEach((select) => {
    select.addEventListener('change', (event) => {
        // Obtener el elemento tr ancestro más cercano del select
        const fila = select.closest('tr');
        // Asegurarse de que se encontró una fila
        if (fila) {
            // Actualizar la clase de la fila basada en el valor seleccionado
            fila.className = event.target.value.replace(/\s/g, '-');
            
            // Obtener el botón dentro de la fila
            const boton = fila.querySelector('button[type="submit"]');
            // Asegurarse de que se encontró el botón
            if (boton) {
                // Cambiar el texto del botón según el tipo de pago seleccionado
                if (event.target.value === 'Pago a Registrar') {
                    boton.textContent = 'Posponer';
                } else {
                    boton.textContent = 'Enviar datos';
                }
            } else {
                console.error('No se encontró el botón correspondiente a la fila.');
            }
        } else {
            console.error('No se encontró la fila correspondiente al select.');
        }
    });
});


