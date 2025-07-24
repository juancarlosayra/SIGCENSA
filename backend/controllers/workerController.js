const { getMSSQLPool } = require('../config/dbMSSQL');

exports.getWorkerById = async (req, res) => {
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


exports.getAllWorkers = async (req, res) => {
  const pool = getMSSQLPool();

  if (!pool) {
    return res.status(404).json({ message: 'MS SQL is not available' });
  }

  try {
    const result = await pool.request().query('SELECT * FROM RH_CENSA_2013');

    if(result.recordset.length === 0){
      return res.status(404).json({message: 'Workers not found'});
    }

    res.json(result.recordset)
    
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error getting workers'});
  }
}