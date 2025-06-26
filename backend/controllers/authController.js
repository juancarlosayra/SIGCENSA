const { generateToken } = require('../utils/jwt');
const { pool } = require('../config/dbMSSQL');

const login = async (req, res) => {
  const { user, password } = req.body;

  try {
    const result = await pool.request()
      .input('user', sql.VarChar, user)
      .query('SELECT * FROM users WHERE name = @user');

    if (result.recordset.length === 0 || result.recordset[0].password !== password) {
      return res.status(400).json({ message: 'User or password incorrect' });
    }

    const user = result.recordset[0];
    const token = generarToken({ id: user.id, name: user.name });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error starting session' });
  }
};

module.exports = { login };