const db = require('../util/database');

module.exports = class Deuda {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor() {

    }

    static fetchNoPagados() {
        return db.execute(`SELECT A.Nombre, A.Apellidos, A.matricula, (D.montoAPagar - D.Descuento) AS "montoAPagar", 
        D.montoPagado, D.fechaLimitePago 
        FROM Deuda AS D, Alumno AS A 
        WHERE D.Matricula = A.Matricula AND 
        Pagado = 0 AND Now() > D.fechaLimitePago`);
    }
}