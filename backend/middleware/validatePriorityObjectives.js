const PriorityObjective = require('../models/PriorityObjective');

const validatePriorityObjectives = async (req, res, next) => {
  const { priority, priority_objectives } = req.body;

  const VALID_PRIORITIES = ['Nacional', 'Sectorial', 'Institucional'];

  // 1. Verificar que se envíen los campos necesarios
  if (!priority || !Array.isArray(priority_objectives) || priority_objectives.length === 0) {
    return res.status(400).json({
      message: 'Los campos "priority" y "priority_objectives" son obligatorios.'
    });
  }

  // 2. Validar que el priority sea uno permitido
  if (!VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      message: `priority inválido. Debe ser uno de: ${VALID_PRIORITIES.join(', ')}`
    });
  }

  try {
    // 3. Obtener los objetivos válidos para esa priority desde la BD
    const allowedObjectives = await PriorityObjective.find({ priority });
    const validNames = allowedObjectives.map(obj => obj.objective);

    // 4. Verificar que cada objetivo enviado esté en la lista permitida
    const invalid = priority_objectives.filter(obj => !validNames.includes(obj));

    if (invalid.length > 0) {
      return res.status(400).json({
        message: 'Algunos objetivos no son válidos para este nivel de prioridad.',
        invalid,
        validForThisLevel: validNames
      });
    }

    // ✅ Todo correcto → pasa al siguiente middleware o controlador
    next();

  } catch (error) {
    console.error('Error en middleware validatePriorityObjectives:', error);
    res.status(500).json({
      message: 'Error interno al validar los objetivos de prioridad.'
    });
  }
};

module.exports = validatePriorityObjectives;