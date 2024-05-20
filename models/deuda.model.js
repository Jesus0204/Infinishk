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

    static fetchNoPagados(fecha_actual) {
        return db.execute(`SELECT DISTINCT (matricula) FROM Deuda AS D, Colegiatura AS C, Periodo As P
        WHERE D.IDColegiatura = C.IDColegiatura AND C.IDPeriodo = P.IDPeriodo AND
        Pagado = 0 AND ? > fechaLimitePago AND P.periodoActivo = 1 `, [fecha_actual]);
    }

    static fetchDeuda(matricula) {
        return db.execute(`SELECT (D.montoAPagar - D.Descuento - D.montoPagado) AS "montoAPagar" 
        FROM Colegiatura AS C, Deuda AS D, Periodo AS P
        WHERE C.IDColegiatura = D.IDColegiatura AND C.IDPeriodo = P.IDPeriodo 
        AND P.periodoActivo = '1' AND D.Matricula = ? AND D.Pagado = 0`,
            [matricula]);
    };

    static fetchDeudaConsultarAlumno(matricula) {
        return db.execute(`SELECT A.Nombre, A.Apellidos, A.matricula, 
        (D.montoAPagar - D.Descuento) AS 'montoAPagar',
        ((D.montoAPagar - D.Descuento) - D.montoPagado) AS 'saldoPendiente', 
        D.montoPagado, D.fechaLimitePago, D.Pagado, D.Descuento
        FROM Deuda AS D, Alumno AS A, Colegiatura AS C, Periodo AS P
        WHERE D.Matricula = A.Matricula AND D.IDColegiatura = C.IDColegiatura AND
        C.IDPeriodo = P.IDPeriodo AND periodoActivo = 1 AND D.matricula = ?`,
            [matricula]);
    }

    static fetchDeudaEstado(matricula) {
        return db.execute(`SELECT A.Nombre, A.Apellidos, A.matricula, 
        (D.montoAPagar - D.Descuento) AS 'montoAPagar',
        ((D.montoAPagar - D.Descuento) - D.montoPagado) AS 'saldoPendiente', 
        D.montoPagado, D.fechaLimitePago, D.Pagado, D.Descuento
        FROM Deuda AS D, Alumno AS A, Colegiatura AS C, Periodo AS P
        WHERE D.Matricula = A.Matricula AND D.IDColegiatura = C.IDColegiatura AND
        C.IDPeriodo = P.IDPeriodo AND periodoActivo = 1 AND D.matricula = ?`,
            [matricula]);
    }

    static fetchEstadoDeCuenta(matricula) {
        return db.execute(`SELECT D.montoAPagar, D.montoPagado, D.fechaLimitePago, D.descuento, D.pagado, P.motivo, 
        P.montoPagado, P.nota, P.metodoPago, P.fechaPago
        FROM Deuda AS D, Pago AS P, Alumno AS A, Colegiatura AS C, Periodo AS Pe
        WHERE D.matricula = A.matricula AND D.IDDeuda = P.IDDeuda AND   
        C.IDPeriodo = Pe.IDPeriodo AND D.IDColegiatura = C.IDColegiatura AND Pe.periodoActivo = True   
        AND D.Matricula = ?
        ORDER BY D.pagado ASC
        LIMIT 0, 1000`, [matricula]);
    }


    static fetchEstado(matricula) {
        return db.execute('SELECT Pagado FROM Deuda WHERE Matricula = ?',
            [matricula]);
    };

    static fetchDeudaPagada(matricula) {
        return db.execute('SELECT (montoAPagar-Descuento-montoPagado) AS "montoAPagar" FROM Deuda WHERE Matricula = ? AND Pagado = 1',
            [matricula]);
    };

    static fetchColegiatura(id) {
        return db.execute('SELECT IDColegiatura FROM Deuda WHERE IDDeuda = ?',
            [id]);
    };

    static statusDeuda(id) {
        return db.execute('SELECT Pagado FROM Deuda WHERE IDDeuda = ?',
            [id]);
    };

    static fetchDeudaDatos(matricula) {
        return db.execute(`SELECT A.Nombre, A.Apellidos, A.matricula, 
        (D.montoAPagar - D.Descuento) AS 'montoAPagar',
        ((D.montoAPagar - D.Descuento) - D.montoPagado) AS 'saldoPendiente', 
        D.montoPagado, D.fechaLimitePago, D.Pagado, D.Descuento
        FROM Deuda AS D, Alumno AS A, Colegiatura AS C, Periodo AS P
        WHERE D.Matricula = A.Matricula AND D.IDColegiatura = C.IDColegiatura AND
        C.IDPeriodo = P.IDPeriodo AND periodoActivo = 1 AND D.matricula = ?`,
            [matricula]);
    }

    static update_transferencia(monto, id_deuda) {
        return db.execute('UPDATE Deuda SET montoPagado = montoPagado + ? WHERE IDDeuda = ?',
            [monto, id_deuda]);
    };

    static fetchAlumnos_DeudaActual() {
        return db.execute(`SELECT COUNT(DISTINCT (Matricula)) AS "alumnosTotales" 
        FROM Deuda AS D, Colegiatura AS C, Periodo As P 
        WHERE D.IDColegiatura = C.IDColegiatura AND 
        C.IDPeriodo = P.IDPeriodo AND P.periodoActivo = 1`);
    };

    static fetchIDDeuda(matricula) {
        return db.execute('SELECT IDDeuda FROM Deuda WHERE Matricula = ? AND Pagado = 0 AND Now() < fechaLimitePago',
            [matricula]);
    };

    static fetchIDDeudaPagada(matricula) {
        return db.execute('SELECT IDDeuda FROM Deuda WHERE Matricula = ? AND Pagado = 1',
            [matricula]);
    };

    static fetchNoPagadas(IDColegiatura) {
        return db.execute(`SELECT IDDeuda, (montoAPagar - Descuento) AS 'montoAPagar', 
        fechaLimitePago, montoPagado FROM Deuda WHERE Pagado = 0
        AND IDColegiatura = ? `, [IDColegiatura]);
    };

    static update_Deuda(monto_a_usar, id_deuda) {
        return db.execute('UPDATE Deuda SET montoPagado = montoPagado + ? WHERE IDDeuda = ?',
            [monto_a_usar, id_deuda]);
    };

    static fetchDeudasPeriodo(fecha_actual) {
        return db.execute(`SELECT IDDeuda, montoAPagar, fechaLimitePago
        FROM Deuda AS D, Colegiatura AS C, Periodo AS P
        WHERE C.IDColegiatura = D.IDColegiatura AND C.IDPeriodo = P.IDPeriodo
        AND P.periodoActivo = '1' AND D.Pagado = 0 AND D.Recargos = 0 AND D.fechaLimitePago < ?`,
            [fecha_actual]);
    };

    static fetchDeudasRecordatorio(fecha_actual) {
        return db.execute(`SELECT montoAPagar, fechaLimitePago, U.correoElectronico
        FROM Deuda AS D, Colegiatura AS C, Periodo AS P, Usuario AS U
        WHERE C.IDColegiatura = D.IDColegiatura AND C.IDPeriodo = P.IDPeriodo 
        AND U.IDUsuario = D.Matricula AND P.periodoActivo = '1' AND D.Pagado = 0 
        AND D.fechaLimitePago > ?`, [fecha_actual]);
    };

    static fetchDeudasCorreoAtrasado(fecha_actual) {
        return db.execute(`SELECT fechaLimitePago, U.correoElectronico
        FROM Deuda AS D, Colegiatura AS C, Periodo AS P, Usuario AS U
        WHERE C.IDColegiatura = D.IDColegiatura AND C.IDPeriodo = P.IDPeriodo 
        AND U.IDUsuario = D.Matricula AND P.periodoActivo = '1' AND D.Pagado = 0 
        AND D.fechaLimitePago < ?`, [fecha_actual]);
    }

    static setRecargosDeuda(IDDeuda, montoRecargo) {
        return db.execute(`UPDATE Deuda SET montoAPagar = ?, Recargos = 1
        WHERE IDDeuda = ?`, [montoRecargo, IDDeuda]);
    };

    static fetchAlumnos_Atrasados(fecha_actual) {
        return db.execute(`SELECT COUNT(DISTINCT(Matricula)) AS 'alumnosAtrasados' FROM Deuda AS D, Colegiatura AS C, Periodo As P
        WHERE D.IDColegiatura = C.IDColegiatura AND C.IDPeriodo = P.IDPeriodo AND
        Pagado = 0 AND ? > fechaLimitePago AND P.periodoActivo = 1`, [fecha_actual]);
    };

    static fetchIDColegiatura(matricula) {
        return db.execute('SELECT IDColegiatura FROM Deuda WHERE Matricula = ?',
            [matricula]);
    }
}