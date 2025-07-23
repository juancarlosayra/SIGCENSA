const Project = require('../models/Project');

/**
 * Controlador para crear un nuevo proyecto
 * 
 * ✅ El worker ya fue validado por validateWorkerExists
 * ✅ Los objetivos ya fueron validados por validatePriorityObjectives
 * ✅ El controlador solo se enfoca en crear y guardar
 */
exports.createProject = async (req, res) => {
  try {
    // Extraemos datos del body
    const {
      program_code,
      program_name,
      project_code,
      project_name,
      project_classification,
      fields_of_knowledge,
      priority,
      priority_objectives,
      principal_entity,
      project_chief,
      added_entities,
      added_entity_director,
      added_entity_direction,
      added_entity_province,
      added_entity_phone,
      added_entity_email,
      project_start,
      project_end,
      funding,
      project_resume,
      key_words,
      problem_to_solve
    } = req.body;

    // ✅ El middleware validateWorkerExists ya verificó al worker y adjuntó req.worker
    const { workerId, name: workerName } = req.worker;

    // Creamos el nuevo proyecto
    const newProject = new Project({
      program_code,
      program_name,
      project_code,
      project_name,
      project_classification,
      fields_of_knowledge,
      priority,
      priority_objectives,
      principal_entity,
      project_chief,
      added_entities,
      added_entity_director,
      added_entity_direction,
      added_entity_province,
      added_entity_phone,
      added_entity_email,
      project_start,
      project_end,
      funding,
      project_resume,
      key_words,
      problem_to_solve,
      worker_id: workerId,
      worker_name: workerName
    });

    // Guardamos en MongoDB
    await newProject.save();

    // Respuesta exitosa
    res.status(201).json({
      message: 'Proyecto creado exitosamente',
      project: newProject
    });

  } catch (error) {
    console.error('Error al guardar el proyecto:', error);

    // Manejo de errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }

    // Error genérico del servidor
    res.status(500).json({
      message: 'Error interno del servidor al crear el proyecto'
    });
  }
};