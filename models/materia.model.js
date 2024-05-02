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

    static fetchOne(idexterna) {
        return db.execute(`SELECT IDMateria, Nombre, planEstudios, Creditos,IDMateriaExterna
        FROM materia WHERE IDMateriaExterna = ?`, [idexterna]);
    }

    static updateMateria(id,nombre,planEstudios,semestre,creditos,idexterno) {
        return db.execute('UPDATE materia SET IDMateria=?, Nombre=?, planEstudios=?, semestreImpartido=?, Creditos=?  WHERE IDMateriaExterna=?', [id,nombre,planEstudios,semestre,creditos,idexterno])
    }

    static saveMateria(id,nombre,plan,semestre,creditos,idexterno){
        return db.execute('INSERT INTO `materia`(`IDMateria`, `Nombre`, `planEstudios`, `semestreImpartido`, `Creditos`, `IDMateriaExterna`) VALUES (?,?,?,?,?,?)', [id,nombre,plan,semestre,creditos,idexterno])
    }

    static fetchID(idexterna) {
        return db.execute(`SELECT IDMateria FROM materia WHERE IDMateriaExterna = ?`, [idexterna]);
    }

    static fetchIDPorGrupo(IDGrupo){
        return db.execute(`SELECT IDMateria FROM grupo WHERE IDGrupo = ?`, [IDGrupo]);
    }

}