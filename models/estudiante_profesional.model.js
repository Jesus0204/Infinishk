const db = require('../util/database');

module.exports = class estudianteProfesional {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_Matricula,mi_semestreActual,mi_porcBeca,mi_planEstudio){
        this.Matricula = mi_Matricula;
        this.semestreActual = mi_semestreActual;
        this.porcBeca = mi_porcBeca;
        this.planEstudio = mi_planEstudio;
    }

    static update_alumno_profesional(matricula,semestre){
        return db.execute('UPDATE estudianteProfesional SET Matricula=?, semestreActual = ? WHERE Matricula=?',[matricula,semestre,matricula])
    }

    static save_alumno_profesional(matricula,semestre,plan,beca){
        return db.execute('INSERT INTO `estudianteProfesional`(`Matricula`, `semestreActual`, `porcBeca`, `planEstudio`, `horarioConfirmado`) VALUES (?,?,?,?, 0)',[matricula,semestre,beca,plan])
    }

    static fetchBeca(matricula){
        return db.execute('SELECT porcBeca FROM estudianteProfesional WHERE Matricula = ?', [matricula])
    }

    static fetchOne(matricula) {
        return db.execute(`SELECT Matricula, semestreActual, porcBeca 
        FROM estudianteProfesional WHERE Matricula = ?`, [matricula]);
    }

    static fetchDatos(matricula) {
        return db.execute(`SELECT Alumno.Matricula, Alumno.Nombre, Alumno.Apellidos, Alumno.referenciaBancaria, estudianteProfesional.semestreActual, 
        estudianteProfesional.porcBeca, estudianteProfesional.planEstudio
        FROM Alumno JOIN estudianteProfesional on Alumno.Matricula = estudianteProfesional.Matricula 
        WHERE Alumno.Matricula = ?;`, [matricula]);
    }

    static async update(id, ref, beca) {
        try {
            const [rows, fieldData] = await db.execute(`CALL updateDatosAlumno(?,?,?)`, [id, ref, beca]);
            return rows;
        } catch (error) {
            console.error("Error executing query:", error);
            throw error; // Re-throw the error to be caught by the caller
        }
    }

    static fetchHorarioConfirmado(matricula) {
        return db.execute(`SELECT horarioConfirmado FROM estudianteProfesional WHERE Matricula = ?`, [matricula]);
    }

    static fetchAlumnosNoConfirmados() {
        return db.execute(`SELECT Matricula FROM estudianteProfesional WHERE horarioConfirmado = 0`);
    }

     static updateHorarioAccepted(matricula) {
         return db.execute(`UPDATE estudianteProfesional SET horarioConfirmado = 1 WHERE Matricula = ?`, [matricula]);
     }
    
}