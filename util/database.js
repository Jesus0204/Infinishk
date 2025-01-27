const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'via_pago',
    password: 'Queretaro2017#'
});


module.exports = pool.promise();