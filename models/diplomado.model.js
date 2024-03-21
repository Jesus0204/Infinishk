const db = require('../util/database');

module.exports = class Diplomado{
    constructor(mi_IDDiplomado,mi_Duracion,mi_precioDiplomado,mi_nombreDiplomado){
        this.IDDiplomado = mi_IDDiplomado;
        this.Duracion = mi_Duracion;
        this.precioDiplomado = mi_precioDiplomado;
        this.nombreDiplomado = mi_nombreDiplomado;
    }


    save() {
        return db.execute(
            `INSERT INTO tropa (IDDiplomado, Duracion, precioDiplomado, nombreDiplomado) VALUES (?, ?, ?, ?)`, 
                [this.IDDiplomado, this.Duracion, this.precioDiplomado, this.nombreDiplomado]);
    }

    static fetchOne(nombre){
        return db.execute('Select * from diplomado WHERE nombreDiplomado = ?',[nombre]);
    }

    static update(id,duracion,precio,nombre){
        return db.execute('UPDATE diplomado SET IdDiplomado=?, Duracion=?, precioDiplomado=?, nombreDiplomado=? WHERE nombreDiplomado=?',
        [id,duracion,precio,nombre,nombre]);
    }

}