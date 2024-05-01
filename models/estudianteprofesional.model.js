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
};

