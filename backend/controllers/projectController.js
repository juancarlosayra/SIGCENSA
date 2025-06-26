const Project = require('../models/Project');
const { pool } = require('../config/dbMSSQL');

const createProject = async (req, res) => {
  const { workerId, name, description } = req.body;

  try {
    const result = await pool.request()
      .input('id', sql.VarChar, workerId)
      .query('SELECT name FROM workers WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    const newProject = new Project({
      name,
      description,
      workerId,
      workerName: result.recordset[0].name
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating a new Project' });
  }
};

module.exports = { createProject };