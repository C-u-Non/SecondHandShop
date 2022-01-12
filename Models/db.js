const mysql = require('mysql');

const db = mysql.createConnection({
    host: '103.200.22.212',
    // port: 2083,
    user: 'itsangta',
    password: 'Longthuong1908',
    database: 'itsangta_webshare',
    dubug: true
});

module.exports = db;