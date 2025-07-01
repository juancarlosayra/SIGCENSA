const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createUser = async (req, res) => {
  const { name, pass } = req.body;

  try {
    // Validación básica
    if (!name || !pass) {
      return res.status(400).json({ message: 'Nombre y contraseña son obligatorios' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ name });

    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    // 🔐 Encriptar la contraseña
    const hashedPass = await bcrypt.hash(pass, 10); // 10 es el número de rondas de encriptación

    // Crear el nuevo usuario
    const newUser = await User.create({
      name,
      pass: hashedPass // ✅ Guardamos la contraseña en formato hash
    });

    // Responder con éxito
    res.status(201).json({
      message: 'Usuario creado correctamente',
      user: {
        name: newUser.name
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};

module.exports = { createUser };