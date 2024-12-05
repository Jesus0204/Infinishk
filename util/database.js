const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'viapago2',
    password: ''
});

module.exports = pool.promise();