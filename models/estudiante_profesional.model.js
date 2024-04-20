const db = require('../util/database');

module.exports = class Alumno {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_Matricula,mi_semestreActual,mi_porcBeca,mi_planEstudio){
        this.Matricula = mi_Matricula;
        this.semestreActual = mi_semestreActual;
        this.porcBeca = mi_porcBeca;
        this.planEstudio = mi_planEstudio;
    }

    static update_alumno_profesional(matricula,semestre,planEstudio){
        return db.execute('UPDATE estudianteprofesional SET Matricula=?, semestreActual = ? , planEstudio = ? WHERE Matricula=?',[matricula,semestre,planEstudio,matricula])
    }



}