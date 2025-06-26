const { pool } = require('../config/dbMSSQL');

const getWorkerById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.request()
      .input('id', sql.VarChar, id)
      .query('SELECT * FROM workers WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting worker' });
  }
};

module.exports = { getWorkerById };