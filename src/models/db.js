const mysql = require('mysql2/promise');
require('dotenv').config(); 

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('✅ Conexão com o banco de dados estabelecida!');
    connection.release();
  }
});

module.exports = pool;
