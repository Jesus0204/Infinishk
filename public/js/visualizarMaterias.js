function showSemestre(semestre) {
    // Ocultar todos los divs
    const semestres = document.querySelectorAll('div[id]');
    semestres.forEach(div => div.classList.add('is-hidden'));

    // Mostrar el div del semestre seleccionado
    document.getElementById(semestre).classList.remove('is-hidden');

    // Activar el tab correspondiente
    const tabs = document.querySelectorAll('.tabs li');
    tabs.forEach(tab => tab.classList.remove('is-active'));
    document.getElementById('nav_' + semestre).classList.add('is-active');
}

// Mostrar el primer semestre por defecto al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    showSemestre('<%= semestres[0].semestre %>');
});