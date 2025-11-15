<template>
  <div class="invitations-container">

    <!-- Contenido principal -->
    <main class="invitations-main">
      <h1>Invitations</h1>

      <!-- Estado: Sin invitaciones -->
      <div v-if="invitations.length === 0" class="empty-state">
        <div class="empty-icon">📧</div> <!-- Ícono de sobre (puedes usar SVG o FontAwesome) -->
        <p>You don't have any invitations yet</p>
        <p class="subtitle">Ask your company owner or administrator to add you using your email address.</p>
      </div>

      <!-- Estado: Con invitaciones -->
      <div v-else class="invitations-list">
        <div v-for="invitation in invitations" :key="invitation.id" class="invitation-item">
          <div class="invitation-details">
            <span class="invitation-code">Invitation Code: {{ invitation.code }}</span>
            <span class="invitation-email">{{ invitation.email }}</span>
          </div>
          <div class="invitation-actions">
            <button class="btn-cancel" @click="cancelInvitation(invitation.id)">Cancel</button>
            <button class="btn-accept" @click="acceptInvitation(invitation.id)">Accept</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Datos de ejemplo (reemplaza con fetch de API)
const invitations = ref([
  {
    id: 1,
    code: 'INV000001',
    email: 'user@example.com'
  }
  // Agrega más objetos para más invitaciones
])

// Funciones de manejo de acciones
const cancelInvitation = (id) => {
  // Lógica para cancelar: e.g., API call, remove from list
  invitations.value = invitations.value.filter(inv => inv.id !== id)
  console.log(`Invitation ${id} cancelled`)
}

const acceptInvitation = (id) => {
  // Lógica para aceptar: e.g., API call, redirect to dashboard
  console.log(`Invitation ${id} accepted`)
  router.push('/dashboard')
}
</script>

<style scoped>
/* Estilos basados en el tema de Rutana: Azul principal (#007BFF o similar), fondos blancos/grises */
.invitations-container {
  display: flex;
  height: 100vh;
  font-family: 'Arial', sans-serif;
}

.app-header {
  background-color: #004080; /* Azul oscuro para header */
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  width: 250px; /* Sidebar fijo */
  flex-shrink: 0;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin: 1rem 0;
}

.sidebar a {
  color: white;
  text-decoration: none;
}

.sidebar a:hover {
  text-decoration: underline;
}

.profile {
  margin-top: auto;
  padding-top: 2rem;
}

.invitations-main {
  flex: 1;
  padding: 2rem;
  background-color: #f8f9fa; /* Gris claro */
}

h1 {
  color: #004080;
  border-bottom: 2px solid #007BFF;
  padding-bottom: 0.5rem;
}

/* Estado vacío */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

/* Lista de invitaciones */
.invitations-list {
  max-width: 600px;
}

.invitation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.invitation-details {
  flex: 1;
}

.invitation-code {
  display: block;
  font-weight: bold;
  color: #004080;
}

.invitation-email {
  color: #6c757d;
  font-size: 0.9rem;
}

.invitation-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-cancel, .btn-accept {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-cancel {
  background-color: #dc3545; /* Rojo para cancelar */
  color: white;
}

.btn-accept {
  background-color: #28a745; /* Verde para aceptar */
  color: white;
}

.btn-cancel:hover, .btn-accept:hover {
  opacity: 0.8;
}
</style>