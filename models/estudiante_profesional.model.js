const db = require('../util/database');

module.exports = class estudianteProfesional {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_Matricula, mi_semestreActual, mi_porcBeca, mi_planEstudio) {
        this.Matricula = mi_Matricula;
        this.semestreActual = mi_semestreActual;
        this.porcBeca = mi_porcBeca;
        this.planEstudio = mi_planEstudio;
    }

    static update_alumno_profesional(matricula,semestre){
        return db.execute('UPDATE estudianteProfesional SET Matricula=?, semestreActual = ? WHERE Matricula=?',[matricula,semestre,matricula])
    }

    static save_alumno_profesional(matricula, semestre, plan, beca) {
        return db.execute('INSERT INTO `estudianteProfesional`(`Matricula`, `semestreActual`, `porcBeca`, `planEstudio`) VALUES (?,?,?,?)', [matricula, semestre, beca, plan])
    }

    static fetchBeca(matricula){
        return db.execute('SELECT porcBeca FROM estudianteProfesional WHERE Matricula = ?', [matricula])
    }

}