const { getMSSQLPool } = require('../config/dbMSSQL');
const sql = require('mssql');

/**
 * Middleware para validar que un workerId exista en la base de datos de SQL Server.
 * Debe usarse en rutas que requieran workerId en el body.
 * 
 * Añade `req.worker = { id, name }` si el trabajador existe.
 */
const validateWorkerExists = async (req, res, next) => {
  const { workerId } = req.body;

  // 1. Validar que se envíe workerId
  if (!workerId) {
    return res.status(400).json({
      message: 'El campo "workerId" es obligatorio para crear o asignar el proyecto.'
    });
  }

  try {
    const pool = getMSSQLPool();
    if (!pool) {
      return res.status(500).json({
        message: 'No hay conexión activa con la base de datos de trabajadores.'
      });
    }

    // 2. Consultar si el trabajador existe
    const result = await pool.request()
      .input('id', sql.VarChar, workerId)
      .query('SELECT id, name FROM workers WHERE id = @id');

    // 3. Si no se encuentra
    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: `Trabajador con ID "${workerId}" no encontrado en la base de datos.`
      });
    }

    // 4. ✅ Éxito: adjuntamos los datos del trabajador al request
    req.worker = result.recordset[0]; // Ahora puedes usar req.worker.name en el controlador

    // 5. Continuar al siguiente middleware/controlador
    next();

  } catch (error) {
    console.error('Error en middleware validateWorkerExists:', error);

    // Manejo de errores comunes
    if (error.name === 'ConnectionError') {
      return res.status(500).json({
        message: 'Error de conexión con la base de datos de trabajadores.'
      });
    }

    if (error.code === 'EREQUEST') {
      return res.status(400).json({
        message: 'Error en la consulta a la base de datos.',
        detail: error.message
      });
    }

    return res.status(500).json({
      message: 'Error interno al validar el trabajador.',
      error: error.message
    });
  }
};

module.exports = validateWorkerExists;