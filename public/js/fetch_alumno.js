let alumno = "";
const bt_buscar = document.querySelector('#Boton_buscar');
const ayuda_alumno = document.querySelector('#ayuda_alumno');
const ayuda_vacio = document.querySelector('#ayuda_vacio');
const buscar = document.querySelector('#buscar');

// Checar si hay contenido dentro del input, pata desactivar el boton
function checar_alumno() {
    if (buscar.value != alumno) {
        bt_buscar.disabled = true;
        ayuda_alumno.classList.remove('is-hidden');
    } else {
        ayuda_alumno.classList.add('is-hidden');
        bt_buscar.disabled = false;
    }

    if (buscar.value.length === 0) {
        bt_buscar.disabled = true;
        ayuda_alumno.classList.add('is-hidden');
    }
}

const buscar_alumno = () => {
    const valor_busqueda = document.getElementById('buscar').value;
    //función que manda la petición asíncrona
    fetch('/pagos/fetch_alumno/autocomplete/' + valor_busqueda, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((result) => {
        return result.json(); //Regresa otra promesa
    }).then((data) => {
        if (data.alumnos.length == 0 && bt_buscar.disabled == true) {
            ayuda_vacio.classList.remove('is-hidden');
        } else {
            ayuda_vacio.classList.add('is-hidden');
        }

        if (data.alumnos.length === 1) {
            alumno = data.alumnos[0].Nombre + ' ' + data.alumnos[0].Apellidos + ' ' +
                data.alumnos[0].Matricula;
        }

        checar_alumno()

        if (data.alumnos.length == 0) {
            ayuda_alumno.classList.add('is-hidden');
        }

        $("#buscar").autocomplete({
            source: data.alumnos.map(function (alumnos) {
                return (alumnos.Nombre + ' ' + alumnos.Apellidos + ' ' +
                    alumnos.Matricula);
            }),
            select: function (event, ui) {
                alumno = ui.item.value;
                bt_buscar.disabled = false;
            },
            minLength: 3
        });

    }).catch(err => {
        console.log(err);
    });
};


$("#buscar").on("autocompleteselect", function (event, ui) {
    ayuda_alumno.classList.add('is-hidden');
});

const ayuda_buscar = document.querySelector('#ayuda_buscar');

// Checar si hay contenido dentro del input, pata desactivar el boton
function checar_contenido() {
    bt_buscar.disabled = buscar.value.length === 0;
    if (buscar.value.length === 0) {
        ayuda_buscar.classList.remove('is-hidden');
        ayuda_vacio.classList.add('is-hidden');
    } else {
        ayuda_buscar.classList.add('is-hidden');
    }
}

buscar.addEventListener('input', buscar_alumno);
buscar.addEventListener('input', checar_contenido);
buscar.addEventListener('input', checar_alumno);