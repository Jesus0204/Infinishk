const mysql = require('mysql2');

const pool = mysql.createPool(process.env.JAWSDB_MARIA_URL);

module.exports = pool.promise();
