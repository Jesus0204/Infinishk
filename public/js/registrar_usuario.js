
$(document).ready(function() {
    $('#roles').change(function() {
        if ($(this).val() === 'Alumno') {
            $('#alumnoFields').show();
            $('#noAlumnoFields').hide();
        } else {
            $('#alumnoFields').hide();
            $('#noAlumnoFields').show();
        }
    });
});

// Initialize all input of date type.
const calendars = bulmaCalendar.attach('[type="date"]', {
    startDate: new Date(twoMonthsAgo.format()),
    endDate: new Date(),
    displayMode: 'dialog',
    dateFormat: 'yyyy/MM/dd',
    maxDate: new Date(),
    weekStart: 1,
    lang: 'es',
    showFooter: false, 
    isRange: true
});

