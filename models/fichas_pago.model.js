const db = require('../util/database');

module.exports = class Fichas {
    constructor(mi_montoAPagar,mi_montoPagado,mi_Descuento,mi_notaModificacion,mi_modificadoAt,mi_fechaLimitePago){
        this.montoAPagar = mi_montoAPagar;
        this.montoPagado = mi_montoPagado;
        this.Descuento = mi_Descuento;
        this.notaModificacion = mi_notaModificacion;
        this.modificadoAt = mi_modificadoAt;
        this.fechaLimitePago = mi_fechaLimitePago;
    }

    static fetch(valor_busqueda){
        return db.execute(`SELECT IDDeuda, Pagado, montoAPagar, montoPagado, Descuento, montoRecargos, notaModificacion, modificado_At,
        fechaLimitePago FROM Deuda
        JOIN Colegiatura on Deuda.IDColegiatura = Colegiatura.IDColegiatura
        JOIN Periodo ON Colegiatura.IDPeriodo = Periodo.IDPeriodo
        WHERE Deuda.Matricula = ? AND Periodo.periodoActivo = 1;`, [valor_busqueda]);
    }

    static async update(deuda, descuento, fechaLimitePago, notaModificacion, modificador, id) {
        const [rows, fields] = await db.execute(`CALL updateFicha(?,?,?,?,?,?)`, [deuda, descuento, fechaLimitePago, notaModificacion, modificador, id]);
        return rows;
    }
    
    static delete_grupo_update_fichas(uMatricula, uIDGrupo, uPrecioActual, uIDMateria, uBeca, uCredito){
        db.execute(`CALL dar_baja_grupo_sin_recargo(?, ?, ?, ?, ?,?)`, [uMatricula, uIDGrupo, uPrecioActual, uIDMateria, uBeca, uCredito])
    }

    static delete_grupo_update_fichas60(uMatricula, uIDGrupo, uPrecioActual, uIDMateria, uBeca, uCredito){
        db.execute(`CALL dar_baja_grupo_60(?, ?, ?, ?, ?,?)`, [uMatricula, uIDGrupo, uPrecioActual, uIDMateria, uBeca, uCredito])
    }

    static delete_grupo_update_fichas100(uMatricula, uIDGrupo, uPrecioActual, uIDMateria, uBeca, uCredito){
        db.execute(`CALL dar_baja_grupo_100(?, ?, ?, ?, ?,?)`, [uMatricula, uIDGrupo, uPrecioActual, uIDMateria, uBeca, uCredito])
    }

    static update_fichas_beca(uMatricula, uBeca, uCredito){
        db.execute(`CALL recalcularMontoTotalYAplicarBeca(?, ?, ?)`, [uMatricula, uBeca, uCredito])
    }

    static async calcularNumeroDeudas(uMatricula, uFechaInicio, uFechaFin) {
        const [rows] = await db.execute(`
            SELECT COUNT(*) AS total
            FROM Deuda
            WHERE Matricula = ?
              AND fechaLimitePago >= ?
              AND fechaLimitePago <= ?
              AND Pagado = 0
        `, [uMatricula, uFechaInicio, uFechaFin]);
        return rows[0].total;
    }

    static actualizarMaterias(uMatricula, uPrecioActual, uIDMateria, uBeca, uCredito){
        db.execute(`CALL actualizarMaterias(?,?, ?, ?,?)`, [uMatricula, uPrecioActual, uIDMateria, uBeca, uCredito])
    }
    
} 