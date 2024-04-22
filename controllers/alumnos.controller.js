const PlanPago = require('../models/planpago.model');
const PrecioCredito = require('../models/precio_credito.model');
const Usuario = require('../models/usuario.model');
const Alumno = require('../models/alumno.model');
const EstudianteProfesional = require('../models/estudiante_profesional.model');
const Materia = require('../models/materia.model');
const Periodo = require('../models/periodo.model');
const Posee = require('../models/posee.model');
const { getAllUsers, getAllCourses,getAllPeriods,getUserGroups } = require('../util/adminApiClient');

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.getHorario = async (request, response, next) => {
    const matricula = 10007;
    const periodo = Periodo.fetchActivo();
    const periodoActivo = periodo[0][0].IDPeriodo;

    try {
        const gruposAlumno = await adminClient.getUserGroups(periodoActivo, matricula);

        if (!gruposAlumno || !gruposAlumno.data) {
            throw new Error('No se ha encontrado un horario');
        }

        const parsedData = gruposAlumno.data.map(grupoAlumno => {
            const room = grupoAlumno.room;
            const dayAndTime = `${grupoAlumno.schedules[0].weekday} ${grupoAlumno.schedules[0].start_hour}-${grupoAlumno.schedules[0].end_hour}`;
            const className = grupoAlumno.course.name;
            const credits = grupoAlumno.course.credits;
            const plan = grupoAlumno.course.plans[0].degree.name;
            const semester = grupoAlumno.course.plans_courses[0].semester;
            const professorName = `${grupoAlumno.professor.name} ${grupoAlumno.professor.first_surname}`;

            return {
                room,
                dayAndTime,
                className,
                credits,
                plan,
                semester,
                professorName,
            };
        });

        // Aquí puedes hacer lo que necesites con los datos parseados, como enviarlos en la respuesta
        response.json(parsedData);
    } catch (error) {
        next(error);
    }
};


