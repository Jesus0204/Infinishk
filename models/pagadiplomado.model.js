const db = require('../util/database');

module.exports = class pagoDiplomado {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_Matricula, mi_IDDiplomado, mi_fechaPago, mi_montoPagado, mi_Motivo, mi_Nota, mi_tipoPago) {
        this.Matricula = mi_Matricula;
        this.IDDiplomado = mi_IDDiplomado;
        this.fechaPago = mi_fechaPago;
        this.montoPagado = mi_montoPagado;
        this.Motivo = mi_Motivo;
        this.Nota = mi_Nota;
        this.tipoPago = mi_tipoPago;
    }

    static save_transferencia(matricula, id, fecha, monto, nota) {
        return db.execute(
            `CALL insertarPagoDiplomado (?,?,?,?, '', ?, 'Transferencia');`,
            [matricula, id, fecha, monto, nota]);
    }

    static save_tarjeta(matricula, id, fecha, monto, motivo, nota) {
        return db.execute(
            `CALL insertarPagoDiplomado (?,?,?,?,?,?,'Tarjeta');`,
            [matricula, id, fecha, monto, motivo, nota]);
    }


    static save_pago_manual(matricula, IDDiplomado, fechaPago, montoPagado, motivo, nota, metodoPago) {
        return db.execute(`CALL insertarPagoDiplomado (?, ?, ?, ?, ?, ?, ?)`,
            [matricula, IDDiplomado, fechaPago, montoPagado, motivo, nota, metodoPago]);
    };

    static save_pago_tarjeta_web(matricula, IDDiplomado, fechaPago, montoPagado, motivo, nota, metodoPago, referenciaPago) {
        return db.execute(`INSERT INTO pagaDiplomado(Matricula, IDDiplomado, fechaPago, montoPagado, Motivo, Nota, metodoPago, estadoPago, referenciaPago)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?);`,
            [matricula, IDDiplomado, fechaPago, montoPagado, motivo, nota, metodoPago, referenciaPago]);
    };

    static update_estado_pago(fechaPago, referenciaPago) {
        return db.execute(`UPDATE pagaDiplomado SET estadoPago = 1, fechaPago = ? WHERE referenciaPago = ?`, [fechaPago, referenciaPago]);
    }

    static fetch_fecha_pago(fecha) {
        return db.execute('SELECT fechaPago,montoPagado FROM pagaDiplomado WHERE fechaPago = ?',
            [fecha]);
    }

    static fetchDatosDiplomado(fechaInicio, fechaFin) {
        return db.execute(`SELECT DISTINCT PD.Matricula, A.Nombre, A.Apellidos, A.referenciaBancaria, PD.IDDiplomado,
        D.nombreDiplomado, PD.Motivo, PD.montoPagado, PD.metodoPago, PD.fechaPago, 
        PD.Nota, PD.referenciaPago FROM pagaDiplomado AS PD JOIN Alumno AS A ON PD.Matricula = A.Matricula 
        JOIN Diplomado AS D ON PD.IDDiplomado = D.IDDiplomado JOIN Cursa AS C ON D.IDDiplomado = C.IDDiplomado 
        WHERE PD.fechaPago BETWEEN ? AND ? AND PD.estadoPago = 1 ORDER BY PD.Matricula ASC`, [fechaInicio, fechaFin]);
    }

    static fetchPagosDiplomado(matricula) {
        return db.execute(`SELECT P.IDPagaDiplomado, P.Matricula, P.IDDiplomado, P.fechaPago, P.montoPagado, 
            P.Motivo, P.metodoPago, P.Nota, P.referenciaPago, D.nombreDiplomado
            FROM pagaDiplomado AS P, Diplomado AS D 
            WHERE P.IDDiplomado = D.IDDiplomado AND P.estadoPago = 1 AND Matricula = ?
            ORDER BY P.fechaPago ASC
            LIMIT 0, 1000`, [matricula]);
    }

    static delete(id) {
        return db.execute(`DELETE FROM PagaDiplomado WHERE IDPagaDiplomado = ?`, [id]);
    }
};