const db = require('../util/database');

module.exports = class Cursa{
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_Matricula,mi_IDDiplomado){
        this.Matricula = mi_Matricula;
        this.IDDiplomado = mi_IDDiplomado;
    };

    static fetchDiplomado(matricula){
        return db.execute('SELECT IDDiplomado FROM Cursa WHERE Matricula = ?',
        [matricula]);
    };

    static fetchDiplomadosCursando(matricula) {
        return db.execute(`SELECT D.nombreDiplomado, C.IDDiplomado, D.precioDiplomado, D.fechaInicio, D.fechaFin
        FROM Cursa AS C, Diplomado AS D 
        WHERE C.IDDiplomado = D.IDDiplomado AND D.fechaFin > Now() AND D.fechaInicio < Now() 
        AND C.Matricula = ?`, [matricula]);
    };

    static fetchPagosHechos(matricula, IDDiplomado) {
        return db.execute(`SELECT fechaPago, montoPagado
        FROM pagaDiplomado WHERE Matricula = ? AND 
        IDDiplomado = ?`, [matricula, IDDiplomado]);
    };
}