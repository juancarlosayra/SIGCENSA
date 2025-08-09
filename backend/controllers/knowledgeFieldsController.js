const Knowledge_field = require('../models/Knowledge_field');

exports.getAllKnowledgeFields = async (req, res) => {
    try {
    const fields = await Knowledge_field.find().sort({ path: 1 });
    res.json(fields);
    } catch (error) {
    console.error('Error al obtener campos de conocimiento:', error);
    res.status(500).json({ message: 'Error del servidor' });
  };
};