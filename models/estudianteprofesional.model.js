const db = require('../util/database');

module.exports = class EstudianteProfesional{
    constructor(mi_matricula, mi_semestreActual, mi_porcBeca){
        this.Matricula = mi_matricula;
        this.semestreActual = mi_semestreActual;
        this.porcBeca = mi_porcBeca;
    }

    static fetchOne(matricula){
        return db.execute(`SELECT Matricula, semestreActual, porcBeca 
        FROM EstudianteProfesional WHERE Matricula = ?`, [matricula]);
    }

    static fetchDatos(matricula){
        return db.execute(`SELECT Alumno.Matricula, Alumno.Nombre, Alumno.Apellidos, Alumno.referenciaBancaria, estudianteprofesional.semestreActual, 
        EstudianteProfesional.porcBeca, EstudianteProfesional.planEstudio
        FROM Alumno JOIN EstudianteProfesional on Alumno.Matricula = EstudianteProfesional.Matricula 
        WHERE Alumno.Matricula = ?;`, [matricula]);
    }

    static async update(id, ref, beca){
        try {
            const [rows, fieldData] = await db.execute(`CALL updateDatosAlumno(?,?,?)`, [id, ref, beca]);
            return rows;
        } catch (error) {
            console.error("Error executing query:", error);
            throw error; // Re-throw the error to be caught by the caller
        }
    }    
};