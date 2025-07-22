const { authenticate } = require('../config/ldap.js');

async function login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Usuario o contraseña incorrectos'
        });
    }

    authenticate(username, password, (success, message) => {
        if (!success) {
            return res.status(401).json({
                success: false,
                message: 'Usuario o contraseña incorrectos'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Usuario autenticado'
        });
    });
}

module.exports = { login };
