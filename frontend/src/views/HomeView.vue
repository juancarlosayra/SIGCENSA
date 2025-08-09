<script setup>
// import TheWelcome from '../components/TheWelcome.vue';
</script>

<template>
  <main class="container mx-auto px-4 py-8">
    <!-- Componente de bienvenida -->
    <TheWelcome />

    <!-- Sección principal -->
    <div class="text-center p-6 mt-8 bg-white rounded-lg shadow">
      <h1 class="text-3xl font-bold text-gray-800">SIGCENSA</h1>
      <p class="text-lg text-gray-600 mt-2">Sistema de Gestión de Proyectos de Investigación</p>
      
      <router-link 
        to="/create" 
        class="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition duration-200 font-medium"
      >
        🚀 Crear Nuevo Proyecto
      </router-link>
    </div>
  </main>
</template>

<style scoped>
/* Estilos opcionales específicos de esta vista */
.container {
  max-width: 1200px;
}
</style>