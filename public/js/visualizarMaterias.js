document.addEventListener('DOMContentLoaded', function() {
    const semestresData = JSON.parse(document.getElementById('semestresData').innerText);
    const pageSize = 5; // Número de materias por página

    semestresData.forEach(semestre => {
        let currentPage = 1;
        const totalPages = Math.ceil(semestre.materias.length / pageSize);

        // Mostrar la primera página al cargar
        showPage(semestre.semestre, currentPage);

        // Manejar el botón "Siguiente"
        document.getElementById(`next-button_${semestre.semestre}`).addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                showPage(semestre.semestre, currentPage);
            }
        });

        // Manejar el botón "Anterior"
        document.getElementById(`prev-button_${semestre.semestre}`).addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                showPage(semestre.semestre, currentPage);
            }
        });

        // Función para mostrar las materias paginadas
        function showPage(semestreId, page) {
            const tableBody = document.getElementById(`tableBody_${semestreId}`);
            tableBody.innerHTML = ''; // Limpiar la tabla
          
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const paginatedMaterias = semestre.materias.slice(start, end);
          
            paginatedMaterias.forEach(materia => {
              const row = `
                <tr>
                  <td>${materia.IDMateria}</td>
                  <td>${materia.Nombre}</td>
                  <td>${materia.Creditos}</td>
                  <td>${materia.IDMateriaExterna}</td>
                </tr>`;
              tableBody.innerHTML += row;
            });
          
            updatePaginationNumbers(semestreId, page); // Actualizar los números de paginación
        }
          
        // Función para actualizar los números de paginación
        function updatePaginationNumbers(semestreId, page) {
            const paginationNumbers = document.getElementById(`pagination-numbers_${semestreId}`);
            paginationNumbers.innerHTML = ''; // Limpiar los números previos

            for (let i = 1; i <= totalPages; i++) {
                const pageNumber = document.createElement('li');
                pageNumber.innerHTML = `<a class="pagination-link ${i === page ? 'is-current' : ''}">${i}</a>`;

                pageNumber.addEventListener('click', () => {
                    currentPage = i;
                    showPage(semestreId, i);
                });

                paginationNumbers.appendChild(pageNumber);
            }
        }
    });
});



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
