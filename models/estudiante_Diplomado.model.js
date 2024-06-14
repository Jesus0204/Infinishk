const db = require('../util/database');

module.exports = class estudianteDiplomado {

    constructor(mi_Matricula, mi_fechaInscripcion) {
        this.Matricula = mi_Matricula;
        this.fechaInscripción = mi_fechaInscripcion;
    }

    save(){
        return db.execute(
            `INSERT INTO estudianteDiplomado VALUES (?, ?)`, 
            [this.Matricula, this.fechaInscripción]);
    }

    static fetchDatos(matricula) {
        return db.execute(`SELECT Alumno.Matricula, Alumno.Nombre, Alumno.Apellidos, Alumno.referenciaBancaria,
            estudianteDiplomado.fechaInscripcion
            FROM Alumno
            JOIN estudianteDiplomado on Alumno.Matricula = estudianteDiplomado.Matricula
             JOIN Cursa on estudianteDiplomado.Matricula = Cursa.Matricula
             WHERE Alumno.Matricula = ?`, [matricula]);
    }

    static fetchDiplomadoCursando(matricula, fecha_actual) {
        return db.execute(`SELECT Diplomado.nombreDiplomado
            FROM Cursa
            JOIN Diplomado on Cursa.IDDiplomado = Diplomado.IDDiplomado
            WHERE Cursa.Matricula = ? AND Diplomado.fechaFin > ? AND Diplomado.fechaInicio < ?`, [matricula, fecha_actual, fecha_actual])
    }

    static async update(id, ref) {
        return db.execute(`UPDATE Alumno SET referenciaBancaria = ? WHERE matricula = ?`, [ref, id]);
    }
}