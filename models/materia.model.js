const db = require('../util/database');

module.exports = class Materia {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_IDMateria, mi_Nombre, mi_planEstudios, mi_semestreImpartido, mi_Creditos, mi_IDMateriaExterna) {
        this.IDMateria = mi_IDMateria
        this.Nombre = mi_Nombre;
        this.planEstudios = mi_planEstudios;
        this.semestreImpartido = mi_semestreImpartido;
        this.Creditos = mi_Creditos;
        this.IDMateriaExterna = mi_IDMateriaExterna;
    }

    static fetchOne(idmateria) {
        return db.execute(`SELECT IDMateria, Nombre, planEstudios, Creditos,IDMateriaExterna
        FROM Materia WHERE IDMateria = ? `, [idmateria]);
    }

    static updateMateria(id,nombre,planEstudios,semestre,creditos,idexterno) {
        return db.execute('UPDATE Materia SET IDMateriaExterna=?, Nombre=?, planEstudios=?, semestreImpartido=?, Creditos=?  WHERE IDMateria=?', [idexterno,nombre,planEstudios,semestre,creditos,id])
    }

    static saveMateria(id,nombre,plan,semestre,creditos,idexterno){
        return db.execute('INSERT INTO `Materia`(`IDMateria`, `Nombre`, `planEstudios`, `semestreImpartido`, `Creditos`, `IDMateriaExterna`) VALUES (?,?,?,?,?,?)', [id,nombre,plan,semestre,creditos,idexterno])
    }

    static fetchIDPorGrupo(IDGrupo){
        return db.execute(`SELECT IDMateria FROM Grupo WHERE IDGrupo = ?`, [IDGrupo]);
    }

    static fetchPlanes(){
        return db.execute(`SELECT DISTINCT planEstudios FROM Materia`)
    }

    static fetchMaterias(planEstudios){
        return db.execute(`SELECT nombre, semestreImpartido FROM Materia WHERE planEstudios = ? GROUP BY semestreImpartido, nombre;`,[planEstudios])
    }
}