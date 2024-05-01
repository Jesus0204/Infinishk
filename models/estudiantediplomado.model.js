const db = require('../util/database');

module.exports = class EstudianteDiplomado{
    constructor(mi_matricula, mi_fechaInscripcion){
        this.Matricula = mi_matricula;
        this.fechaInscripcion = mi_fechaInscripcion;
    }

    static fetchDatos(matricula){
        return db.execute(`SELECT Alumno.Matricula, Alumno.Nombre, Alumno.Apellidos, Alumno.referenciaBancaria, 
        estudiantediplomado.fechaInscripcion, diplomado.nombreDiplomado 
        FROM Alumno 
        JOIN estudiantediplomado on Alumno.Matricula = estudiantediplomado.Matricula 
        JOIN cursa on estudiantediplomado.Matricula = cursa.Matricula 
        JOIN diplomado on cursa.IDDiplomado = diplomado.IDDiplomado 
        WHERE Alumno.Matricula = ? and diplomado.diplomadoActivo = 1;`, [matricula]);
    }

    static async update(id, ref) {
        return db.execute(`UPDATE Alumno SET referenciaBancaria = ? WHERE matricula = ?`, [ref, id]);
    }
};