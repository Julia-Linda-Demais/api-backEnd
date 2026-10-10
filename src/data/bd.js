import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'mysql-orion.alwaysdata.net',
    user: 'orion',
    password: 'OrionTCC@67',
    database: 'orion_bd'
});

export default pool;