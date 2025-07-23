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
  priority:{type: String, required: true},//check with queen ai ->
  priority_objectives: {type: Text, required: true},//how to make this the same field
  principal_entity: {type: String, required: true},
  project_chief: { type: String, required: true },

  added_entities: {type: String},
  added_entity_director: {type: String},
  added_entity_direction: {type: String},
  added_entity_province: {type: String},
  added_entity_phone: {type: Number},
  added_entity_email: {type: String},

  project_start: {type: Date},
  project_end: {type: Date},

  total_investment_cup: {type: Number, required: true},
  total_investment_mlc: {type: Number},
  financial_font_mlc: {type: String},
  mlc_inverter: {type: String},
  mlc_amount: {type: Number},
  mlc_type: {type: String},

  project_resume: {type: Text, required: true},
  key_words: {type: Text},
  problem_to_solve: {type: Text, required: true},

  
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);