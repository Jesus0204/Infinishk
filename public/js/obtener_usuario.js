let admin = "";
const user = document.querySelector('#user');
const registrarAdmin = document.querySelector('#registrarAdmin');
const ayuda_usuario = document.querySelector('#ayuda_usuario');
const ayuda_vacio = document.querySelector('#ayuda_vacio');
const ayuda_registrado = document.querySelector('#ayuda_registrado');

// Checar si hay contenido dentro del input, pata desactivar el boton
function checar_usuario() {
    if (user.value != admin) {
        registrarAdmin.disabled = true;
        ayuda_usuario.classList.remove('is-hidden');
    } else {
        ayuda_usuario.classList.add('is-hidden');
        registrarAdmin.disabled = false;
    }

    if (user.value.length === 0) {
        ayuda_usuario.classList.add('is-hidden');
        registrarAdmin.disabled = true;
    }
}

const getAdmins = () => { 
    //El token de protección CSRF
    const csrf = document.getElementById('_csrf').value;
    fetch('/configuracion/getAdmins/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'csrf-token': csrf
        },
        body: JSON.stringify({
            input: user.value,
        })
    })
    .then((result) => {
        return result.json(); //Regresa otra promesa
    })
    .then((data) => {
        if (data.registered.length > 0){
            ayuda_registrado.classList.remove('is-hidden');
        } else {
            ayuda_registrado.classList.add('is-hidden');
        }
        if (data.admins.length == 0 && registrarAdmin.disabled == true && data.registered.length == 0) {
            ayuda_vacio.classList.remove('is-hidden');
        } else {
            ayuda_vacio.classList.add('is-hidden');
        }

        if (data.admins.length === 1) {
            admin = data.admins[0]
        }

        checar_usuario();

        if (data.admins.length == 0) {
            ayuda_usuario.classList.add('is-hidden');
        }

        $("#user").autocomplete({
            source: data.admins,
            select: function (event, ui) {
                admin = ui.item.value;
                registrarAdmin.disabled = false;
            },
            minLength: 3
        });
    })
    .catch(error => {
        console.error('Error en la petición fetch:', error);
    });
};

$("#user").on("autocompleteselect", function (event, ui) {
    ayuda_usuario.classList.add('is-hidden');
});

const ayuda_buscar = document.querySelector('#ayuda_buscar');

// Checar si hay contenido dentro del input, pata desactivar el boton
function checar_contenido() {
    registrarAdmin.disabled = user.value.length === 0;
    if (user.value.length === 0) {
        ayuda_buscar.classList.remove('is-hidden');
        ayuda_vacio.classList.add('is-hidden');
    } else {
        ayuda_buscar.classList.add('is-hidden');
    }
}

user.addEventListener('input', getAdmins);
user.addEventListener('input', checar_contenido);
user.addEventListener('input', checar_usuario);
