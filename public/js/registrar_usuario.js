$('#roles').change(function () {
    // Sacas el nombre del rol seleccionado
    var nombreRol = $(this).find(':selected').data('nombreRol');
    // Cambias el DOM para mostrar el nombre
    const nombreRol = document.querySelector('#nombreRol');
    nombreRol.innerHTML = '<strong>Nombre: </strong> $' + nombreRol;
});