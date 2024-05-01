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
}