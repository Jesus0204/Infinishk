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

    static fetchSchedule(matricula) {
        return db.execute(`SET @porcbeca = (SELECT CASE
            WHEN porcBeca > 0 THEN (1 - (porcBeca/100))
            ELSE 1
            END FROM estudianteprofesional
            WHERE Matricula = '1001');
        (‘SELECT M.Nombre, G.IDGrupo, G.Profesor, G.Horario, G.Salon,
            G.fechaInicio, G.fechaTermino, A.horarioAceptado,
        ((P.precioPesos * M.Creditos)*@porcbeca) AS Precio_materia
        FROM Grupo AS G
        JOIN Materia AS M ON G.IDMateria = M.IDMateria
        JOIN Preciocredito AS P ON G.IDPrecioCredito = P.IDPrecioCredito
        JOIN Alumno AS A ON G.Matricula = A.Matricula
        WHERE P.precioActivo = 1
        AND G.Matricula = ?`, [matricula]);
    }

    static fetchPrecioTotal(matricula){
        return db.execute(`SET @porcbeca = (SELECT CASE
            WHEN porcBeca > 0 THEN (1 - (porcBeca/100))
            ELSE 1
            END FROM estudianteprofesional
            WHERE Matricula = '1001');
        (‘SELECT (SUM(P.precioPesos * M.Creditos)*@porcbeca) AS Preciototal
        FROM Grupo AS G
        JOIN Materia AS M ON G.IDMateria = M.IDMateria
        JOIN Preciocredito AS P ON G.IDPrecioCredito = P.IDPrecioCredito
        WHERE P.precioActivo = 1
        AND G.Matricula = ?`, [Matricula]);
    }

}
