const db = require('../util/database');

module.exports = class Deuda {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_IDDeuda,mi_IDColegiatura,mi_Matricula,mi_montoPagado,mi_montoAPagar,mi_fechaLimitePago,mi_Pagado){
        this.IDDeuda = mi_IDDeuda;
        this.IDColegiatura = mi_IDColegiatura;
        this.Matricula = mi_Matricula
        this.montoPagado = mi_montoPagado;
        this.montoAPagar =mi_montoAPagar;
        this.fechaLimitePago = mi_fechaLimitePago;
        this.Pagado = mi_Pagado;
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

    static fetchEstadoDeCuenta(matricula){
        return db.execute(`SELECT D.montoAPagar, D.montoPagado, D.fechaLimitePago, D.descuento, D.pagado, P.motivo, 
        P.montoPagado, P.nota, P.metodoPago, P.fechaPago
        FROM Deuda AS D, Pago AS P, Alumno AS A, Colegiatura AS C, Periodo AS Pe
        WHERE D.matricula = A.matricula AND D.IDDeuda = P.IDDeuda AND   
        C.IDPeriodo = Pe.IDPeriodo AND D.IDColegiatura = C.IDColegiatura AND Pe.periodoActivo = True   
        AND D.matricula = ?
        ORDER BY D.pagado ASC
        LIMIT 0, 1000`, [matricula]);
    }


    static fetchEstado(matricula){
        return db.execute('SELECT Pagado FROM deuda WHERE Matricula = ?',
        [matricula]);
    }

    static update_transferencia(monto,id_deuda){
        return db.execute('UPDATE Deuda SET montoPagado = montoPagado + ? WHERE IDDeuda = ?',
        [monto, id_deuda]);
    }

    static fetchIDDeuda(matricula){
        return db.execute('SELECT IDDeuda FROM deuda WHERE Matricula = ?',
        [matricula]);
    }
    
    static fetchIDColegiatura(matricula){
        return db.execute('SELECT IDColegiatura FROM deuda WHERE Matricula = ?',
        [matricula]);
    }
    
}