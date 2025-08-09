const sql = require('mssql');
const { getMSSQLPool } = require('../config/dbMSSQL');

exports.getAllWorkers = async (req, res) => {
  const { id } = req.params;

  const pool = getMSSQLPool();

  if (!pool) {
    return res.status(503).json({ error: 'MS SQL is not available' });
  }

  try {
    const result = await pool.request()
      .input('id', id)
      .query('SELECT * FROM RH_CENSA_2013 WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.json({name: result.recordset[0].name});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting worker' });
  }
};


exports.searchWorkers = async (req, res) => {
  const pool = getMSSQLPool();
   const { q } = req.query;

   if (!pool) {
     return res.status(404).json({ message: 'MS SQL is not available' });
    }
   
    if (!q || q.length < 2) {
      return res.status(400).json({ message: 'Consulta "q" debe tener al menos 2 caracteres' });
    }

 try {
  const result = await pool.request()
  .input('name', sql.VarChar, `%${q}%`)
  .query('SELECT id, name FROM RH_CENSA_2013 WHERE name LIKE @name ORDER BY name');

  res.json(result.recordset);
 } catch (error) {
  console.error('Error buscando trabajadores:', error);
    res.status(500).json({ message: 'Error al buscar trabajadores' });
 }
};