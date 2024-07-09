function regresar() {
    window.history.back();
}

document.getElementById('Boton_regresar_fichas').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('redireccionar').submit();
});