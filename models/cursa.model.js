const db = require('../util/database');

module.exports = class Cursa{
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_Matricula,mi_IDDiplomado,mi_fechaInicio,mi_fechaFin){
        this.Matricula = mi_Matricula;
        this.IDDiplomado = mi_IDDiplomado;
        this.fechaInicio = mi_fechaInicio;
        this.fechaFin = mi_fechaFin;
    };

    static fetchDiplomado(matricula){
        return db.execute('SELECT IDDiplomado FROM cursa WHERE Matricula = ?',
        [matricula]);
    };

    static fetchDiplomadosCursando(matricula) {
        return db.execute(`SELECT D.nombreDiplomado, C.IDDiplomado
        FROM Cursa AS C, Diplomado AS D 
        WHERE C.IDDiplomado = D.IDDiplomado AND C.fechaFin > Now() AND C.fechaInicio < Now() 
        AND C.Matricula = ?`, [matricula]);
    };

    static fetchPagosHechos(matricula, IDDiplomado) {
        return db.execute(`SELECT fechaPago, montoPagado
        FROM pagaDiplomado WHERE Matricula = ? AND 
        IDDiplomado = ?`, [matricula, IDDiplomado]);
    };
}