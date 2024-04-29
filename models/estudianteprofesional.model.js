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
        return db.execute(`SELECT Alumno.Matricula, Alumno.Nombre, Alumno.Apellidos, Alumno.referenciaBancaria, estudianteprofesional.semestreActual, EstudianteProfesional.porcBeca 
        FROM Alumno JOIN EstudianteProfesional on Alumno.Matricula = EstudianteProfesional.Matricula 
        WHERE Alumno.Matricula = ?;`, [matricula]);
    }
};