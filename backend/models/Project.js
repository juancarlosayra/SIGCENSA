const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  program_code: {type: Number, required:true},
  program_name: {type: String, required: true},
  project_code: {type: Number, required: true},
  project_name: {type: String, required: true},
  project_classification: {type: String, 
                          enum:["Investigación Básica","Investigación Aplicada","Desarrollo Experimental","Innovación"]},
  fields_of_knowledge: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'knowledgeField',
    required: true,
  }],
  priority:{type: String, required: true, enum:['Nacional','Sectorial','Institucional']},
  priority_objectives: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PriorityObjective',
    required: true
  }],
  principal_entity: {type: String, required: true},
  worker_id: { type: String, required: true },
  worker_name: {type: String, required: true},

  added_entities: {type: String},
  added_entity_director: {type: String},
  added_entity_direction: {type: String},
  added_entity_province: {type: String},
  added_entity_phone: {type: Number},
  added_entity_email: {type: String},

  project_start: {type: Date},
  project_end: {type: Date},

  funding: [{
    currency: {
      type: String,
      required: true,
      enum: ['CUP', 'USD'] // Puedes agregar más: EUR, MLC, etc.
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    source: {
      type: String,
      required: true,
      trim: true
    },
    financier: {
      type: String,
      required: true,
      trim: true
    }
  }],

  project_resume: {type: Text, required: true},
  key_words: {type: Text},
  problem_to_solve: {type: Text, required: true},

  
  created_at: { type: Date, default: Date.now }
});

projectSchema.path('funding').validate(function (funding) {
  const currencies = funding.map(f => f.currency);
  const unique = new Set(currencies).size === currencies.length;
  return unique; // No se puede repetir la misma moneda
}, 'No se puede registrar el mismo tipo de moneda más de una vez.');


module.exports = mongoose.model('Project', projectSchema);