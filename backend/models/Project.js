const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  program_code: {type: Number, required:true},
  program_name: {type: String, required: true},
  project_code: {type: Number, required: true},
  project_name: {type: String, required: true},
  project_classification: {type: String, enum:["Investigación Básica","Investigación Aplicada","Desarrollo Experimental","Innovación"]},
  fields_of_knowledge: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'knowledgeField',
    required: true,
  }],

  description: {type: String},
  worker_id: { type: String, required: true },
  worker_name: {type: String},
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);