const db = require('../util/database');

module.exports = class Liquida {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_matricula, mi_IDPagoExtra) {
        this.matricula = mi_matricula;
        this.IDPagoExtra = mi_IDPagoExtra;
    }

    save() {
        return db.execute(`INSERT INTO Liquida
        (Matricula, IDPagosExtras, fechaPago, Pagado)
        VALUES (?, ?, Null, 0)`, [this.matricula, this.IDPagoExtra]);
    }

    static fetchID(matricula){
        return db.execute('Select IDLiquida from liquida WHERE Matricula = ?',[matricula]);
    }

    static fetchID_Pendientes(matricula) {
        return db.execute('SELECT IDLiquida, IDPagosExtras from liquida WHERE Matricula = ? AND Pagado = 0', [matricula]);
    }

    static fetch_Pendientes(matricula) {
        return db.execute(`SELECT motivoPago, montoPagar From Liquida AS L, pagosExtras AS P
        WHERE L.IDPagosExtras = P.IDPagosExtras AND L.Matricula = ? AND L.Pagado = 0`, 
        [matricula]);
    }

    static save_pago_manual(matricula, pago, fecha, metodo, nota) {
        return db.execute('INSERT INTO Liquida (Matricula, IDPagosExtras, fechaPago, metodoPago, Pagado, Nota) VALUES (?, ?, ?, ?, 1, ?)', [matricula, pago, fecha, metodo, nota]);
    }

    static update_pago_manual(matricula, pago, fecha, metodo, nota, idliquida) {
        return db.execute(`UPDATE Liquida SET fechaPago = ?, metodoPago = ?, Nota = ?, Pagado = 1
        WHERE Matricula = ? AND IDPagosExtras = ? AND IDLiquida = ?`, 
        [fecha, metodo, nota, matricula, pago, idliquida]);
    }
    static fetchNoPagados() {
        return db.execute(`SELECT L.IDLiquida, A.Nombre, A.Apellidos, 
        L.Matricula, P.IDPagosExtras, P.motivoPago, P.montoPagar
        FROM Liquida AS L, pagosExtras AS P, Alumno AS A
        WHERE L.IDPagosExtras = P.IDPagosExtras 
        AND L.Matricula = A.Matricula 
        AND Pagado = 0`);
    }

   static update(id, pago) {
        return db.execute(`UPDATE Liquida 
        SET IDPagosExtras = ? 
        WHERE IDLiquida = ?`,
        [pago, id]);
    }

    static delete(id) {
        return db.execute('DELETE FROM Liquida WHERE IDLiquida = ?', [id]);
    }

}