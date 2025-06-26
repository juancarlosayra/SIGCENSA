const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
  name: String,
  description: String,
  worker_id: { type: String, required: true },
  worker_name: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);