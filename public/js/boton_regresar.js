function regresar() {
    window.history.back();
}

const Btn_regresar_fichas = document.getElementById('Boton_regresar_fichas');

if (Btn_regresar_fichas) {
    Btn_regresar_fichas.addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('redireccionar').submit();
    });
}