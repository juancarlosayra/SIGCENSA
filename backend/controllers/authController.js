const jwt = require('jsonwebtoken');
const { authenticateAD } = require('../config/ldap');
const { tokenBlacklist, getTokenTTL } = require('../utils/tokenUtils');

const login = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ mensaje: 'Usuario y contraseña requeridos.' });
    }

    console.log('🔎 Autenticando en LDAP...');
    const adUser = await authenticateAD(usuario, password);

    if (!adUser || !adUser.usuario) {
      return res.status(401).json({ mensaje: 'Autenticación fallida en LDAP' });
    }

    const tokenPayload = {
      usuario: adUser.usuario,
      displayName: adUser.displayName,
      mail: adUser.mail
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    console.log('✅ Login exitoso, generando respuesta...');
    res.json({ token, user: tokenPayload });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ mensaje: 'Error en la autenticación', error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ message: 'Token no proporcionado o mal formado.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const ttl = getTokenTTL(token);

    if (ttl > 0) {
      tokenBlacklist.add(token);

      setTimeout(() => {
        tokenBlacklist.delete(token);
        console.log('🕒 Token eliminado del blacklist tras expirar');
      }, ttl * 1000);

      return res.json({ message: 'Logout exitoso.' });
    } else {
      return res.json({ message: 'El token ya expiró.' });
    }

  } catch (error) {
    console.error('❌ Error en logout:', error);
    return res.status(401).json({ message: 'Token inválido o expirado.', error: error.message });
  }
};

module.exports = { login, logout };
