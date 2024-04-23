document.querySelectorAll('.form-enviar-datos').forEach((form, index) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        fetch('/configuracion/actualizarAlumnos', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json()) // Convertir la respuesta a JSON
            .then(data => {
                if (!data.success) {
                    // Manejar el caso en que success no es true
                    console.error('La operación no fue exitosa:', data);
                    // Aquí puedes agregar código para mostrar un mensaje de error al usuario
                    alert('Hubo un error en la consulta, por favor intenta de nuevo');
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
                alert('Hubo un error en la consulta, por favor intenta de nuevo');
            });
    });
});

const usuarios_length = document.getElementById('usuarios_length');

for (let count = 0; count < usuarios_length.innerHTML; count++){

    // Accedes a cada input y al boton con el id del counter
    const btn_Subir = document.querySelector('#btn_Subir' + count);
    const referencia = document.querySelector('#referencia' + count);
    const beca = document.querySelector('#beca' + count);

    //  // Checar si hay contenido dentro del input, pata desactivar el boton
    //  function checar_contenido() {
    //      btn_Subir.disabled = nombre.value.length === 0;
    //  }

    //  // Activar mensaje si el motivo no tiene input
    //  function mensaje_nombre() {
    //      if (nombre.value.length === 0) {
    //          ayuda_nombre.classList.remove('is-hidden');
    //      } else {
    //          ayuda_nombre.classList.add('is-hidden');
    //      }
    //  }

    //  function mensaje_monto() {

    //      if (monto.value.includes('e') || monto.value.includes('E')) {
    //          btn_Subir.disabled = true;
    //          ayuda_monto_exponente.classList.remove('is-hidden');
    //      } else {
    //          ayuda_monto_exponente.classList.add('is-hidden');
    //      }
    //  }

     referencia.addEventListener('input', checar_contenido);
     referencia.addEventListener('input', mensaje_nombre);
};