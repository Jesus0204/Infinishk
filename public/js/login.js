function togglePassword(inputId) {
    var x = document.getElementById(inputId);
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar todos los botones de cierre
    const closeButtons = document.querySelectorAll('.notification .delete');

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const notification = button.parentElement; // Selecciona el contenedor padre
            notification.style.display = 'none'; // Oculta la notificación
        });
    });
});