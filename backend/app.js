const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { connectMSSQL } = require('./config/dbMSSQL');
const authRoutes = require('./routes/authRoutes');
const workerRoutes = require('./routes/workerRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const knowledgeFieldRoutes = require('./routes/knowledgeFieldRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173', // URL de tu frontend (Vite)
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Start connections
//connectMSSQL(); // Connect to MS SQL
require('./config/dbMongo')(); // Connect to MongoDB

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/worker', workerRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/user', userRoutes);
app.use('/api/knowledge-fields', knowledgeFieldRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${ process.env.PORT || 3000 }`)
});

// Start server
mongoose.connection.on('connected', () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running in http://localhost:${PORT}`);
  });
});