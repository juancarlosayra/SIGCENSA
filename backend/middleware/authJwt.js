const { checkToken } = require('../utils/jwt');

const authJwt = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).json({ message: 'Token not given' });
  }

  try {
    const decoded = checkToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
};

module.exports = authJwt;