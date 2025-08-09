<template>
  <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Crear Nuevo Proyecto</h1>

    <!-- Mensaje de estado -->
    <div v-if="message" class="p-3 mb-4 text-sm rounded" :class="success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
      {{ message }}
    </div>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Información del trabajador -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h2 class="text-lg font-semibold mb-3">Responsable del Proyecto</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Buscar trabajador por nombre</label>
            <input
              v-model="searchQuery"
              @input="searchWorkers"
              placeholder="Ej: Juan Pérez"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />

            <!-- Resultados -->
            <ul v-if="workers.length > 0" class="border border-gray-300 rounded-md mt-2 max-h-40 overflow-y-auto bg-white">
              <li
                v-for="worker in workers"
                :key="worker.id"
                @click="selectWorker(worker)"
                class="p-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
              >
                {{ worker.name }} <span class="text-xs text-gray-500">({{ worker.id }})</span>
              </li>
            </ul>

            <p v-if="searchQuery && workers.length === 0 && !searchLoading" class="text-sm text-gray-500 mt-2">
              No se encontraron trabajadores.
            </p>
            <p v-if="searchLoading" class="text-sm text-blue-600 mt-2">Buscando...</p>
          </div>

          <!-- Mostrar seleccionado -->
          <div v-if="selectedWorker" class="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm">
            <strong>Seleccionado:</strong> {{ selectedWorker.name }} (ID: {{ selectedWorker.id }})
          </div>
        </div>
      </div>

      <!-- Datos del proyecto -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h2 class="text-lg font-semibold mb-3">Datos del Proyecto</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Código del Proyecto *</label>
            <input v-model="form.project_code" type="number" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre del Proyecto *</label>
            <input v-model="form.project_name" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Clasificación *</label>
            <select v-model="form.project_classification" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="">-- Selecciona --</option>
              <option>Investigación Básica</option>
              <option>Investigación Aplicada</option>
              <option>Desarrollo Experimental</option>
              <option>Innovación</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Entidad Principal *</label>
            <input v-model="form.principal_entity" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Jefe del Proyecto *</label>
            <input v-model="form.project_chief" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Alcance (Prioridad) *</label>
            <select v-model="form.priority" @change="loadObjectives" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="">-- Selecciona --</option>
              <option v-for="p in priorities" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Objetivos por prioridad -->
      <div v-if="form.priority" class="bg-blue-50 p-4 rounded-lg">
        <h3 class="font-medium text-blue-800 mb-2">Objetivos del Proyecto</h3>
        <p class="text-sm text-blue-700 mb-3">Selecciona uno o más objetivos del nivel "{{ form.priority }}"</p>
        <div v-if="loadingObjectives" class="text-sm text-blue-600">Cargando objetivos...</div>
        <select v-else v-model="form.priority_objectives" multiple required class="w-full border border-blue-300 rounded-md p-2 h-32">
          <option v-for="obj in objectives" :key="obj" :value="obj">{{ obj }}</option>
        </select>
        <p v-if="!loadingObjectives && objectives.length === 0" class="text-sm text-red-600 mt-2">No hay objetivos definidos para este nivel.</p>
      </div>

      <!-- Campos de conocimiento -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h2 class="text-lg font-semibold mb-3">Campos de Conocimiento</h2>
        <p class="text-sm text-gray-600 mb-2">Selecciona uno o más campos</p>

        <div v-if="loadingKnowledge" class="text-sm text-blue-600 mb-2">
          🔍 Cargando campos de conocimiento...
        </div>

        <select v-else v-model="form.fields_of_knowledge" multiple class="w-full border border-gray-300 rounded-md p-2 h-24">
          <option v-for="field in knowledgeFields" :key="field._id" :value="field.path">
            {{ field.name }}
          </option>
        </select>

        <p v-if="!loadingKnowledge && knowledgeFields.length === 0" class="text-sm text-red-600 mt-2">
          ⚠️ No hay campos de conocimiento disponibles.
        </p>
      </div>

      <!-- Financiamiento -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h2 class="text-lg font-semibold mb-3">Financiamiento</h2>
        <div v-for="(f, index) in form.funding" :key="index" class="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
          <select v-model="f.currency" class="border rounded p-2" required>
            <option value="CUP">CUP</option>
            <option value="USD">USD</option>
          </select>
          <input v-model.number="f.amount" type="number" placeholder="Monto" class="border rounded p-2" required />
          <input v-model="f.source" placeholder="Fuente" class="border rounded p-2" required />
          <input v-model="f.financier" placeholder="Financista" class="border rounded p-2" required />
          <button type="button" @click="removeFunding(index)" class="bg-red-500 text-white rounded px-2 py-1 text-sm">Eliminar</button>
        </div>
        <button type="button" @click="addFunding" class="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
          + Agregar financiamiento
        </button>
      </div>

      <!-- Fechas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
          <input v-model="form.project_start" type="date" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha de Finalización</label>
          <input v-model="form.project_end" type="date" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>

      <!-- Campos adicionales -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Resumen del Proyecto *</label>
          <textarea v-model="form.project_resume" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-24"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Problema a Resolver *</label>
          <textarea v-model="form.problem_to_solve" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-24"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Palabras Clave</label>
          <input v-model="form.key_words" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>

      <!-- Botón de envío -->
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="loading"
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Guardando...' : 'Crear Proyecto' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';

// --- Formulario ---
const form = ref({
  worker_id: '',
  project_code: '',
  project_name: '',
  project_classification: '',
  principal_entity: '',
  project_chief: '',
  priority: '',
  priority_objectives: [],
  fields_of_knowledge: [],
  funding: [{ currency: 'CUP', amount: 0, source: '', financier: '' }],
  project_start: '',
  project_end: '',
  project_resume: '',
  problem_to_solve: '',
  key_words: ''
});

// --- Estados ---
const loading = ref(false);
const message = ref('');
const success = ref(false);

// --- Búsqueda de trabajador ---
const searchQuery = ref('');
const workers = ref([]);
const searchLoading = ref(false);
const selectedWorker = ref(null);

const searchWorkers = async () => {
  if (searchQuery.value.length < 2) {
    workers.value = [];
    return;
  }

  searchLoading.value = true;
  try {
    const res = await api.get('/api/workers/search', {
      params: { q: searchQuery.value }
    });
    workers.value = res.data;
  } catch (err) {
    console.error('Error buscando trabajadores:', err);
    workers.value = [];
  } finally {
    searchLoading.value = false;
  }
};

const selectWorker = (worker) => {
  selectedWorker.value = worker;
  form.value.worker_id = worker.id;
  workers.value = [];
  searchQuery.value = worker.name;
};

// --- Objetivos por prioridad ---
const loadingObjectives = ref(false);
const objectives = ref([]);
const priorities = ['Nacional', 'Sectorial', 'Institucional'];

const loadObjectives = async () => {
  if (!form.value.priority) return;

  loadingObjectives.value = true;
  try {
    const res = await api.get(`/api/objectives/${form.value.priority}`);
    objectives.value = res.data;
  } catch (err) {
    console.error('Error cargando objetivos:', err);
    objectives.value = [];
  } finally {
    loadingObjectives.value = false;
  }
};

// --- Campos de conocimiento (desde API) ---
const knowledgeFields = ref([]);
const loadingKnowledge = ref(false);

const loadKnowledgeFields = async () => {
  loadingKnowledge.value = true;
  try {
    const res = await api.get('/api/knowledge-fields');
    knowledgeFields.value = res.data;
  } catch (err) {
    console.error('Error cargando campos de conocimiento:', err);
  } finally {
    loadingKnowledge.value = false;
  }
};

// Cargar al iniciar
loadKnowledgeFields();

// --- Financiamiento ---
const addFunding = () => {
  form.value.funding.push({ currency: 'CUP', amount: 0, source: '', financier: '' });
};

const removeFunding = (index) => {
  if (form.value.funding.length > 1) {
    form.value.funding.splice(index, 1);
  }
};

// --- Envío del formulario ---
const submitForm = async () => {
  loading.value = true;
  message.value = '';
  try {
    const payload = { ...form.value };
    const res = await api.post('/api/projects', payload);
    success.value = true;
    message.value = '✅ Proyecto creado exitosamente';

    // Reiniciar formulario
    Object.assign(form.value, {
      worker_id: '',
      project_code: '',
      project_name: '',
      project_classification: '',
      principal_entity: '',
      project_chief: '',
      priority: '',
      priority_objectives: [],
      fields_of_knowledge: [],
      funding: [{ currency: 'CUP', amount: 0, source: '', financier: '' }],
      project_start: '',
      project_end: '',
      project_resume: '',
      problem_to_solve: '',
      key_words: ''
    });
    selectedWorker.value = null;
    searchQuery.value = '';
    objectives.value = [];
  } catch (err) {
    success.value = false;
    message.value = err.response?.data?.message || '❌ Error al crear el proyecto';
  } finally {
    loading.value = false;
  }
};
</script>