const db = require('../util/database');

module.exports = class EstudianteDiplomado{
    constructor(mi_matricula, mi_fechaInscripcion){
        this.Matricula = mi_matricula;
        this.fechaInscripcion = mi_fechaInscripcion;
    }

    static fetchDatos(matricula){
        return db.execute(`SELECT Alumno.Matricula, Alumno.Nombre, Alumno.Apellidos, Alumno.referenciaBancaria, estudiantediplomado.fechaInscripcion 
        FROM Alumno JOIN estudiantediplomado on Alumno.Matricula = estudiantediplomado.Matricula 
        WHERE Alumno.Matricula = ?`, [matricula]);
    }
};