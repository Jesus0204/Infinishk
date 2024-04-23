// Initialize all input of date type.
const calendars = bulmaCalendar.attach('[type="date"]', {
    startDate: new Date(),
    displayMode: 'dialog',
    dateFormat: 'yyyy/MM/dd',
    maxDate: new Date(),
    weekStart: 1,
    lang: 'es',
    showFooter: false
});