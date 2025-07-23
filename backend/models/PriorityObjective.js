// models/PriorityObjective.js
const mongoose = require('mongoose');

const priorityObjectiveSchema = new mongoose.Schema({
  priority: {
    type: String,
    required: true,
    enum: ['Nacional', 'Sectorial', 'Institucional']
  },
  objective: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PriorityObjective', priorityObjectiveSchema);