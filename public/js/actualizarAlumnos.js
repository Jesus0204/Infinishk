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

for (let count = 0; count < usuarios_length.innerHTML; count++) {

    // Accedes a cada input y al boton con el id del counter
    const btn_Subir = document.querySelector('#btn_Subir' + count);
    const ayuda_referencia_vacio = document.querySelector('#ayuda_referencia_vacio' + count);
    const ayuda_referencia_negativo = document.querySelector('#ayuda_referencia_negativo' + count);
    const ayuda_referencia_exponente = document.querySelector('#ayuda_referencia_exponente' + count);
    const referencia = document.querySelector('#referencia' + count);
    const ayuda_beca_vacio = document.querySelector('#ayuda_beca_vacio' + count);
    const ayuda_beca_negativo = document.querySelector('#ayuda_beca_negativo' + count);
    const ayuda_beca_exponente = document.querySelector('#ayuda_beca_exponente' + count);
    const beca = document.querySelector('#beca' + count);
    const planEstudio = document.querySelector('#planEstudio' + count);
    const ayuda_plan = document.querySelector('#ayuda_plan' + count);

    // Checar si hay contenido dentro del input, pata desactivar el boton
    function checar_contenido() {
        btn_Subir.disabled = referencia.value.length === 0 || beca.value.length === 0 ||
            parseFloat(referencia.value) <= 0 || parseFloat(beca.value) < 0 || beca.value.includes('e') ||
            beca.value.includes('E') || referencia.value.includes('e') || referencia.value.includes('E') ||
            parseFloat(beca.value) >= 101 || planEstudio.value.length === 0;
    }

    // Activar mensaje si el motivo no tiene input
    function mensaje_referencia() {
        if (referencia.value.length === 0) {
            ayuda_referencia_vacio.classList.remove('is-hidden');
        } else {
            ayuda_referencia_vacio.classList.add('is-hidden');
        }

        if (parseFloat(referencia.value) <= 0) {
            ayuda_referencia_negativo.classList.remove('is-hidden');
        } else {
            ayuda_referencia_negativo.classList.add('is-hidden');
        }

        if (referencia.value.includes('e') || referencia.value.includes('E')) {
            ayuda_referencia_exponente.classList.remove('is-hidden');
        } else {
            ayuda_referencia_exponente.classList.add('is-hidden');
        }
    }

    function mensaje_beca() {
        if (beca.value.length === 0) {
            ayuda_beca_vacio.classList.remove('is-hidden');
        } else {
            ayuda_beca_vacio.classList.add('is-hidden');
        }

        if (parseFloat(beca.value) < 0 || parseFloat(beca.value) >= 101) {
            ayuda_beca_negativo.classList.remove('is-hidden');
        } else {
            ayuda_beca_negativo.classList.add('is-hidden');
        }

        if (beca.value.includes('e') || beca.value.includes('E')) {
            ayuda_beca_exponente.classList.remove('is-hidden');
        } else {
            ayuda_beca_exponente.classList.add('is-hidden');
        }
    }

    function mensajePlan() {
        console.log(planEstudio.value.length)
        if (planEstudio.value.length === 0) {
            ayuda_plan.classList.remove('is-hidden');
        } else {
            ayuda_plan.classList.add('is-hidden');
        }
    }

    referencia.addEventListener('input', checar_contenido);
    referencia.addEventListener('input', mensaje_referencia);
    beca.addEventListener('input', checar_contenido);
    beca.addEventListener('input', mensaje_beca);
    planEstudio.addEventListener('input', checar_contenido);
    planEstudio.addEventListener('input', mensajePlan);
};