function showSemestre(semestre) {
    // Obtener todos los semestres desde el contenido de semestresData
    const allSemestres = JSON.parse(document.getElementById('semestresData').textContent);
    
    allSemestres.forEach(s => {
        // Seleccionar el tab y el contenido correspondiente al semestre
        const tab = document.querySelector(`#nav_${s.semestre}`);
        const content = document.getElementById(s.semestre);

        // Alternar la clase activa y la visibilidad del contenido
        if (s.semestre === semestre) {
            tab.classList.add('is-active'); // Activa la pestaña
            content.classList.remove('is-hidden'); // Muestra el contenido
        } else {
            tab.classList.remove('is-active'); // Desactiva la pestaña
            content.classList.add('is-hidden'); // Oculta el contenido
        }
    });
}

// Inicializar mostrando la primera pestaña
document.addEventListener('DOMContentLoaded', () => {
    const allSemestres = JSON.parse(document.getElementById('semestresData').textContent);
    if (allSemestres.length > 0) {
        const initialSemestre = allSemestres[0].semestre; // Obtiene el primer semestre
        showSemestre(initialSemestre); // Muestra el primer semestre al cargar
    }
});
