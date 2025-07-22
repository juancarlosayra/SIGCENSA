// models/KnowledgeField.js
const mongoose = require('mongoose');

const knowledgeFieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'KnowledgeField' },
  level: { type: Number, default: 0 }, // 0: principal, 1: subgrupo, etc.
  path: { type: String, required: true } // Ej: "Ciencias Básicas/Matemáticas/Álgebra"
}, {
  collection: 'knowledge_fields'
});

module.exports = mongoose.model('KnowledgeField', knowledgeFieldSchema);