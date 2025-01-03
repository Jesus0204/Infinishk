const db = require('../util/database');

module.exports = class Alumno {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_IDGrupo, mi_Matricula, mi_IDMateria, mi_IDPrecioCredito, mi_Profesor, mi_Salon, mi_Horario, mi_fechaInicio, mi_fechaTermino) {
        this.IDGrupo = mi_IDGrupo;
        this.Matricula = mi_Matricula;
        this.IDMateria = mi_IDMateria;
        this.IDPrecioCredito = mi_IDPrecioCredito;
        this.Profesor = mi_Profesor;
        this.Salon = mi_Salon;
        this.Horario = mi_Horario;
        this.fechaInicio = mi_fechaInicio;
        this.fechaTermino = mi_fechaTermino;
    }

    static async fetchSchedule(matricula, periodo) {
        const schedule = await db.execute(`SELECT M.Nombre, G.Periodo, G.IDGrupo, G.Profesor, G.Horario, G.Salon,
                G.fechaInicio, G.fechaTermino, E.horarioConfirmado, M.Creditos,
                (P.precioPesos * M.Creditos) AS Precio_materia
                FROM Grupo AS G
                JOIN Materia AS M ON G.IDMateria = M.IDMateria
                JOIN precioCredito AS P ON G.IDPrecioCredito = P.IDPrecioCredito
                JOIN estudianteProfesional AS E ON G.Matricula = E.Matricula
                WHERE G.IDPrecioCredito = P.IDPrecioCredito
                AND G.Matricula = ?
                AND G.Periodo = ?`, [matricula, periodo]);

        return schedule;
    }

    static async checkGrupoExistente(matricula,idGrupo, periodo) {
        const [result] = await db.execute(
            `SELECT COUNT(*) AS count FROM Grupo WHERE Matricula = ? AND IDGrupoExterno = ? AND Periodo = ?`,
            [matricula, idGrupo, periodo]
        );
        return result[0].count > 0;
    }

    static async fetchPrecioTotal(matricula, periodo){
        const PrecioTotal = await db.execute(`SELECT SUM(P.precioPesos * M.Creditos) AS Preciototal
        FROM Grupo AS G
        JOIN Materia AS M ON G.IDMateria = M.IDMateria
        JOIN precioCredito AS P ON G.IDPrecioCredito = P.IDPrecioCredito
        WHERE G.IDPrecioCredito = P.IDPrecioCredito
        AND G.Matricula = ?
        AND G.Periodo = ?`, [matricula, periodo]);
        return PrecioTotal;
    }

    static saveGrupo(matricula,idmateria,idpreciocredito,profesor,salon,horario,fechaInicio,fechaTermino,idgrupo,periodo){
        return db.execute('INSERT INTO `Grupo`(`Matricula`, `IDMateria`, `IDPrecioCredito`, `Profesor`, `Salon`, `Horario`, `fechaInicio`, `fechaTermino`,`IDGrupoExterno`,`Periodo`) VALUES (?,?,?,?,?,?,?,?,?,?)',[matricula,idmateria,idpreciocredito,profesor,salon,horario,fechaInicio,fechaTermino,idgrupo,periodo]);
    }

    static fetchIDExterno(IDGrupo,matricula){
        return db.execute('SELECT IDGrupoExterno FROM Grupo WHERE IDGrupo = ? AND Matricula = ?',
        [IDGrupo,matricula]);
    }

    static async fetchGrupo(matricula, idMateria, idGrupo) {
        try {
            const [rows] = await db.execute(
                `SELECT * FROM Grupo 
                 WHERE Matricula = ? 
                 AND IDMateria = ? 
                 AND IDGrupoExterno = ?`,
                [matricula, idMateria, idGrupo]
            );
            return rows; // Regresamos las filas obtenidas de la base de datos
        } catch (error) {
            throw error;
        }
    }

}
