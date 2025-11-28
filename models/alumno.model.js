const db = require('../util/database');

module.exports = class Alumno {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_Matricula, mi_Nombre, mi_Apellidos, mi_referenciaBancaria) {
        this.Matricula = mi_Matricula;
        this.Nombre = mi_Nombre;
        this.Apellidos = mi_Apellidos;
        this.referenciaBancaria = mi_referenciaBancaria;
    }

    static fetchNombre(matricula) {
        return db.execute('SELECT Nombre,Apellidos,referenciaBancaria FROM Alumno WHERE Matricula = ?',
            [matricula]);
    }

    static fetch(valor_busqueda) {
        return db.execute(`SELECT Matricula, Nombre, Apellidos FROM Alumno
         WHERE CONCAT_WS(' ', Nombre, Apellidos) LIKE ? OR Matricula LIKE ? `, ['%' + valor_busqueda + '%', '%' + valor_busqueda + '%']);
    }

    static fetch_both(matricula, nombre) {
        return db.execute(`SELECT Matricula, Nombre, Apellidos FROM Alumno
         WHERE CONCAT_WS(' ', Nombre, Apellidos) LIKE ? AND Matricula LIKE ? `, ['%' + nombre + '%', '%' + matricula + '%']);
    }

    static fetchOne(matricula) {
        return db.execute(`SELECT Matricula, Nombre, Apellidos, referenciaBancaria
        FROM Alumno WHERE Matricula = ?`, [matricula]);
    }

    static updateAlumno(matricula, nombre, apellidos) {
        return db.execute('UPDATE Alumno SET Matricula=?, Nombre=?, Apellidos=? WHERE Matricula=?', [matricula, nombre, apellidos, matricula])
    }

    static save_alumno(matricula, nombre, apellidos, referencia) {
        return db.execute('INSERT INTO `Alumno`(`Matricula`, `Nombre`, `Apellidos`, `referenciaBancaria`, `Credito`) VALUES (?,?,?,?,0)', [matricula, nombre, apellidos, referencia])
    }

    static update_credito(matricula, credito) {
        return db.execute(`UPDATE Alumno SET Credito = Credito + ?
        WHERE Matricula = ?`, [credito, matricula]);
    }

    static set_credito(matricula, credito) {
        return db.execute(`UPDATE Alumno SET Credito = ?
        WHERE Matricula = ?`, [credito, matricula]);
    }

    static fetchCredito(matricula){
        return db.execute(`SELECT CAST(credito AS CHAR(20)) FROM Alumno WHERE Matricula = ?`,[matricula]);
    }

    static fetchRef(matricula){
        return db.execute(`SELECT referenciaBancaria FROM Alumno WHERE Matricula = ?`,[matricula]);
    }

    static fetchCreditoINT(matricula){
        return db.execute(`SELECT credito FROM Alumno WHERE Matricula = ?`,[matricula]);
    }

    static fetchCreditoColegiatura(matricula){
        return db.execute(`SELECT 
        Colegiatura.creditoColegiatura
            FROM 
                Deuda
            INNER JOIN 
                Colegiatura ON Deuda.IDColegiatura = Colegiatura.IDColegiatura
            INNER JOIN 
                planPago ON Colegiatura.IDPlanPago = planPago.IDPlanPago
            INNER JOIN 
                Periodo ON Colegiatura.IDPeriodo = Periodo.IDPeriodo
            WHERE 
                Deuda.Matricula = ?
                AND Periodo.periodoActivo = 1
            LIMIT 1;`,[matricula])
    }

    static fetchBeca(matricula) {
        return db.execute(`SELECT 
        CASE 
            WHEN porcBeca > 0 THEN (1 - (porcBeca / 100)) 
            ELSE 1 
        END AS beca
        FROM estudianteProfesional 
        WHERE Matricula = ?`, [matricula])
    }

    static fetchResumenAlumnos() {
        return db.execute(`SELECT A.Nombre, A.Apellidos, D.Matricula, A.referenciaBancaria,
            SUM(CASE WHEN D.Pagado = 1 THEN 1 ELSE 0 END) AS pagosCompletados,
            SUM(D.montoPagado) AS totalPagado,
            SUM(D.montoPagado / D.montoAPagar) AS pagosFormula
            FROM DEUDA AS D, Alumno AS A, Periodo AS P, Colegiatura AS C, Usuario AS U
            WHERE P.periodoActivo = 1 AND
            D.Matricula = A.Matricula AND 
            D.IDColegiatura = C.IDColegiatura AND
            P.IDPeriodo = C.IDPeriodo AND 
            U.IDUsuario = D.Matricula AND U.usuarioActivo = 1
            GROUP BY A.Matricula, A.Nombre, A.Apellidos, A.referenciaBancaria
            ORDER BY A.Matricula`);
    }

    static reiniciarConfirma() {
        const query = `
            UPDATE Confirma
            SET horarioConfirmado = 0
            WHERE IDPeriodo IN (
                SELECT IDPeriodo
                FROM Periodo
                WHERE periodoActivo = 1
            )
        `;
        return db.execute(query);
    }

}
