const db = require('../util/database');

module.exports = class Deuda {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
        constructor(mi_IDDeuda, mi_IDColegiatura, mi_Matricula, mi_montoPagado, mi_montoAPagar, mi_fechaLimitePago, mi_Pagado) {
                this.IDDeuda = mi_IDDeuda;
                this.IDColegiatura = mi_IDColegiatura;
                this.Matricula = mi_Matricula
                this.montoPagado = mi_montoPagado;
                this.montoAPagar = mi_montoAPagar;
                this.fechaLimitePago = mi_fechaLimitePago;
                this.Pagado = mi_Pagado;
    }

    static fetchNoPagados() {
        return db.execute(`SELECT DISTINCT (matricula) FROM Deuda AS D, Colegiatura AS C, Periodo As P
        WHERE D.IDColegiatura = C.IDColegiatura AND C.IDPeriodo = P.IDPeriodo AND
        Pagado = 0 AND Now() > fechaLimitePago AND P.periodoActivo = 1`);
    }

    static fetchDeuda(matricula) {
        return db.execute(`SELECT A.Nombre, A.Apellidos, A.matricula, 
        (D.montoAPagar - D.Descuento) AS 'montoAPagar',
        ((D.montoAPagar - D.Descuento) - D.montoPagado) AS 'saldoPendiente', 
        D.montoPagado, D.fechaLimitePago, D.pagado
        FROM Deuda AS D, Alumno AS A, Colegiatura AS C, Periodo AS P
        WHERE D.Matricula = A.Matricula AND D.IDColegiatura = C.IDColegiatura AND
        C.IDPeriodo = P.IDPeriodo AND periodoActivo = 1 AND D.matricula = ?`, 
        [matricula]);
    }

    static fetchAlumnos_DeudaActual(){
        return db.execute(`SELECT COUNT(DISTINCT (Matricula)) AS "alumnosTotales" 
        FROM Deuda AS D, Colegiatura AS C, Periodo As P 
        WHERE D.IDColegiatura = C.IDColegiatura AND 
        C.IDPeriodo = P.IDPeriodo AND P.periodoActivo = 1`);
    }

    static fetchAlumnos_Atrasados(){
        return db.execute(`SELECT COUNT(DISTINCT(Matricula)) AS 'alumnosAtrasados' FROM Deuda AS D, Colegiatura AS C, Periodo As P
        WHERE D.IDColegiatura = C.IDColegiatura AND C.IDPeriodo = P.IDPeriodo AND
        Pagado = 0 AND Now() > fechaLimitePago AND P.periodoActivo = 1`);
    }
}