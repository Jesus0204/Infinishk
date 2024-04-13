const db = require('../util/database');

module.exports = class Deuda {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor() {

    }

    static fetchNoPagados() {
        return db.execute(`SELECT DISTINCT(matricula) FROM Deuda 
        WHERE Pagado = 0 AND Now() > fechaLimitePago`);
    }

    static fetchDeuda(matricula) {
        return db.execute(`SELECT A.Nombre, A.Apellidos, A.matricula, 
        (D.montoAPagar - D.Descuento) AS 'montoAPagar',
        ((D.montoAPagar - D.Descuento) - D.montoPagado) AS 'saldoPendiente', 
        D.montoPagado, D.fechaLimitePago, D.pagado
        FROM Deuda AS D, Alumno AS A, Colegiatura AS C, Periodo AS P
        WHERE D.Matricula = A.Matricula AND D.IDColegiatura = C.IDColegiatura AND
        C.IDPeriodo = P.IDPeriodo AND periodoActivo = 1 AND D.matricula = ?;`, 
        [matricula]);
    }
}