const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  worker_id: { type: String, required: true },
  worker_name: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);