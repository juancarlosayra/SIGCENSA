// seedKnowledgeFields.js
require('dotenv').config();
const mongoose = require('mongoose');

// Ajusta la ruta según tu estructura
const KnowledgeField = require('./models/Knowledge_field');

// Conexión a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sigcensa', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

// Tus datos reales (ejemplo, reemplázalos con los tuyos)
const knowledgeFieldsData = [
  // === Grupo 1: Ciencias Naturales ===
  { name: 'Ciencias Naturales', parent: null, path: 'Ciencias Naturales' },
  
  // === Sub-grupo 1.1: Matemáticas ===
  { name: 'Matemáticas', parent: 'Ciencias Naturales', path: 'Ciencias Naturales/Matemáticas' },
  { name: 'Matemáticas puras', parent:'Matemáticas', path: 'Ciencias Naturales/Matemáticas/Matemáticas puras' },
  { name: 'Matemáticas aplicadas', parent:'Matemáticas', path: 'Ciencias Naturales/Matemáticas/Matemáticas aplicadas' },
  { name: 'Estadísticas, Probabilidad', parent:'Matemáticas', path: 'Ciencias Naturales/Matemáticas/Estadísticas, Probabilidad' },
  
  // === Sub-grupo 1.2: Informática y Ciencias de la Información 
  { name: 'Informática y Ciencias de la Información', parent: 'Ciencias Naturales', path: 'Ciencias Naturales/Informática y Ciencias de la Información' },
  { name: 'Ciencias de la computación', parent: 'Informática y Ciencias de la Información', path: 'Ciencias Naturales/Informática y Ciencias de la Información/Ciencias de la computación' },
  { name: 'Ciencias de la información', parent: 'Informática y Ciencias de la Información', path: 'Ciencias Naturales/Informática y Ciencias de la Información/ Ciencias de la información' },
  { name: 'Bioinformática', parent: 'Informática y Ciencias de la Información', path: 'Ciencias Naturales/Informática y Ciencias de la Información/Bioinformática' },          
  
  // === Sub-grupo 1.3: Física y Astronomía
  { name: 'Física y Astronomía', parent: 'Ciencias Naturales', path: 'Ciencias Naturales/Física y Astronomía' },
  { name: 'Física atómica, molecular y química', parent: 'Física y Astronomía', path: 'Ciencias Naturales/Física y Astronomía/Física atómica, molecular y química' },
  { name: 'Física de la materia condensada', parent: 'Física y Astronomía', path: 'Ciencias Naturales/Física y Astronomía/Física de la materia condensada' },
  { name: 'Física de partículas, Campos de la Física', parent: 'Física y Astronomía', path: 'Ciencias Naturales/Física y Astronomía/Física de partículas, Campos de la Física' },
  { name: 'Física nuclear', parent: 'Física y Astronomía', path: 'Ciencias Naturales/Física y Astronomía/Física nuclear' },
  { name: 'Física de plasmas y fluídos', parent: 'Física y Astronomía', path: 'Ciencias Naturales/Física y Astronomía/Física de plasmas y fluídos' },
  { name: 'Óptica', parent: 'Física y Astronomía', path: 'Ciencias Naturales/Física y Astronomía/Óptica' },
  { name: 'Acústica', parent: 'Física y Astronomía', path: 'Ciencias Naturales/Física y Astronomía/Acústica' },
  { name: 'Astronomía', parent: 'Física y Astronomía', path: 'Ciencias Naturales/Física y Astronomía/Astronomía' },

  // === Sub-grupo 1.4: Química
  { name: 'Química', parent: 'Ciencias Naturales', path: 'Ciencias Naturales/Química' },
  { name: 'Química orgánica', parent: 'Química', path: 'Ciencias Naturales/Química/Química orgánica' },
  { name: 'Química inorgánica, Química nuclear', parent: 'Química', path: 'Ciencias Naturales/Química/Química inorgánica, Química nuclear' },
  { name: 'Química física', parent: 'Química', path: 'Ciencias Naturales/Química/Química física' },
  { name: 'Ciencia de los polímeros', parent: 'Química', path: 'Ciencias Naturales/Química/Ciencia de los polímeros' },
  { name: 'Electroquímica', parent: 'Química', path: 'Ciencias Naturales/Química/Electroquímica' },
  { name: 'Química coloidal', parent: 'Química', path: 'Ciencias Naturales/Química/Química coloidal' },
  { name: 'Química analítica', parent: 'Química', path: 'Ciencias Naturales/Química/Química analítica' },

  // === Sub-grupo 1.4: Ciencias de la Tierra, Ciencias ambientales

  // === Grupo 2: Ingenierías y Tecnología ===
  { name: 'Ingenierías y Tecnología', path: 'Ingenierías y Tecnología' },
  { name: 'Ingeniería Civil', path: 'Ingenierías y Tecnología/Ingeniería Civil' },
  { name: 'Ingeniería de Software', path: 'Ingenierías y Tecnología/Ingeniería de Software' },
  { name: 'Inteligencia Artificial', path: 'Ingenierías y Tecnología/Ingeniería de Software/Inteligencia Artificial' },
  { name: 'Seguridad Informática', path: 'Ingenierías y Tecnología/Ingeniería de Software/Seguridad Informática' },

  // === Grupo 3: Ciencias Sociales y Humanidades ===
  { name: 'Ciencias Sociales y Humanidades', path: 'Ciencias Sociales y Humanidades' },
  { name: 'Sociología', path: 'Ciencias Sociales y Humanidades/Sociología' },
  { name: 'Economía', path: 'Ciencias Sociales y Humanidades/Economía' },
  { name: 'Macroeconomía', path: 'Ciencias Sociales y Humanidades/Economía/Macroeconomía' },
  { name: 'Microeconomía', path: 'Ciencias Sociales y Humanidades/Economía/Microeconomía' },

  // Agrega todos tus campos reales aquí...
];

// Función principal
async function seedKnowledgeFields() {
  try {
    // Verificar si ya existen registros
    const count = await KnowledgeField.countDocuments();
    if (count > 0) {
      console.log('ℹ️  La colección "knowledgeFields" ya tiene datos. No se insertarán nuevos.');
      console.log(`📊 Total de registros existentes: ${count}`);
      return;
    }

    // Si está vacía, insertamos los nuevos
    console.log('📦 Insertando campos de conocimiento...');
    const result = await KnowledgeField.insertMany(knowledgeFieldsData, { ordered: false });
    console.log(`✅ ${result.length} campos de conocimiento insertados exitosamente.`);

  } catch (error) {
    if (error.code === 11000) {
      console.warn('⚠️  Algunos campos ya existen (duplicados por path). Usa upsert si necesitas actualizar.');
    } else {
      console.error('❌ Error al insertar:', error.message);
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada');
  }
}

// Ejecutar
(async () => {
  await connectDB();
  await seedKnowledgeFields();
})();