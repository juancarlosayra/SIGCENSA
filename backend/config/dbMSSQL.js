const sql = require('mssql');
require('dotenv').config();

const pool = new sql.ConnectionPool({
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  server: process.env.MSSQL_SERVER,
  database: process.env.MSSQL_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
});

const connectMSSQL = async () => {
  try {
    await pool.connect();
    console.log('✅ Connected to MS SQL Server');
  } catch (error) {
    console.error('❌ Error in the connection to MS SQL:', error.message);
    process.exit(1);
  }
};

module.exports = { pool, connectMSSQL };