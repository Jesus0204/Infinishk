const db = require('../util/database');

module.exports = class Liquida {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_IDLiquida,mi_Matricula,mi_IDPagosExtras,mi_fechaPago,mi_tipoPago,mi_Pagado,mi_Nota){
        this.Matricula = mi_Matricula;
        this.IDDiplomado = mi_IDDiplomado;
        this.fechaPago = mi_fechaPago;
        this.montoPagado = mi_montoPagado;
        this.Motivo = mi_Motivo;
        this.Nota = mi_Nota;
        this.tipoPago = mi_tipoPago;
    }

    static fetchID(matricula){
        return db.execute('Select IDLiquida from liquida WHERE Matricula = ?',[matricula]);
    }

    static fetchID_Pendientes(matricula) {
        return db.execute('Select IDLiquida from liquida WHERE Matricula = ? AND Pagado = 0', [matricula]);
    }

    static fetchStatus(matricula){
        return db.execute('Select Pagado from liquida WHERE Matricula = ?',[matricula]);
    }

    static save_transferencia(matricula,id,fecha,nota) {
        return db.execute(
            `INSERT INTO liquida ( Matricula, IDPagosExtras, fechaPago, tipoPago, Pagado, Nota) VALUES (?,?,?,'Transferencia','1',?)`, 
                [matricula,id,fecha,nota]);
    }


    static update_transferencia(nota,fecha,id){
        return db.execute('UPDATE liquida SET Pagado = 1, tipoPago= "Transferencia", fechaPago=?, Nota = ? WHERE IDLiquida = ?',
        [fecha,nota, id]);
    }
}