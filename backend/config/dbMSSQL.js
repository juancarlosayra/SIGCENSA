// const sql = require('mssql');
// require('dotenv').config();

// const pool = new sql.ConnectionPool({
//   user: process.env.MSSQL_USER,
//   password: process.env.MSSQL_PASSWORD,
//   server: process.env.MSSQL_SERVER,
//   database: process.env.MSSQL_DATABASE,
//   options: {
//     encrypt: true,
//     trustServerCertificate: true
//   }
// });

// const connectMSSQL = async () => {
//   try {
//     await pool.connect();
//     console.log('✅ Connected to MS SQL Server');
//   } catch (error) {
//     console.error('❌ Error in the connection to MS SQL:', error.message);
//     process.exit(1);
//   }
// };

// module.exports = { pool, connectMSSQL };

const sql = require('mssql');
require('dotenv').config();

let pool = null;

const connectMSSQL = async () => {
  try {
    pool = new sql.ConnectionPool({
      user: process.env.MSSQL_USER,
      password: process.env.MSSQL_PASSWORD,
      server: process.env.MSSQL_SERVER,
      database: process.env.MSSQL_DATABASE,
      options: {
        encrypt: true,
        trustServerCertificate: true
      }
    });

    await pool.connect();
    console.log('✅ Connected to MS SQL Server');
    return pool;
  } catch (error) {
    console.warn('⚠️ Can not connect to MS SQL:', error.message);
    return null;
  }
};

// Función para obtener conexión
const getMSSQLPool = () => {
  return pool;
};

module.exports = { connectMSSQL, getMSSQLPool };