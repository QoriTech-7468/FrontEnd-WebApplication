<template>
  <div class="auth-page">
    <!-- Left Panel - Branding -->
    <div class="left-panel">
      <div class="brand-content">
        <div class="brand-logo-container">
          <div class="brand-logo-placeholder">
             <img src="../../../assets/rutana-logo.png" alt="Rutana Logo" class="brand-logo-img">
          </div>
        </div>

        <h1 class="animate-fade-in">Rutana</h1>
        <p class="animate-fade-in-delay">La plataforma web más completa para transportistas y empresas de logística en el Perú</p>

        <div class="features">
          <div class="feature animate-slide-in" style="animation-delay: 0.1s">
            <div class="feature-icon">📋</div>
            <span>Gestión completa de rutas y pedidos</span>
          </div>
          <div class="feature animate-slide-in" style="animation-delay: 0.2s">
            <div class="feature-icon">📍</div>
            <span>Seguimiento GPS en tiempo real</span>
          </div>
          <div class="feature animate-slide-in" style="animation-delay: 0.3s">
            <div class="feature-icon">💼</div>
            <span>Panel administrativo avanzado</span>
          </div>
          <div class="feature animate-slide-in" style="animation-delay: 0.4s">
            <div class="feature-icon">📊</div>
            <span>Reportes y análisis detallados</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel - Authentication -->
    <div class="right-panel">
      <div class="auth-container animate-fade-up">
        <div class="auth-header">
          <h2 class="animate-title">{{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}</h2>
          <p class="animate-subtitle">{{ isLogin ? 'Accede a tu cuenta de Rutana' : 'Únete a la plataforma Rutana' }}</p>
        </div>

        <div class="auth-tabs">
          <div
              class="auth-tab"
              :class="{ active: isLogin }"
              @click="switchToLogin"
          >
            Iniciar Sesión
          </div>
          <div
              class="auth-tab"
              :class="{ active: !isLogin }"
              @click="switchToRegister"
          >
            Crear Cuenta
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="hasErrors" class="error-message animate-input">
          <div class="error-icon">⚠️</div>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Login Form -->
        <transition name="form-fade" mode="out-in">
          <form v-if="isLogin" @submit.prevent="handleLogin" class="auth-form" key="login">
            <div class="form-group animate-input" style="animation-delay: 0.1s">
              <label for="loginEmail">Email</label>
              <input
                  type="email"
                  id="loginEmail"
                  class="form-control"
                  placeholder="ejemplo@empresa.com"
                  v-model="loginForm.email"
                  required
              >
            </div>

            <div class="form-group animate-input" style="animation-delay: 0.2s">
              <label for="loginPassword">Contraseña</label>
              <input
                  type="password"
                  id="loginPassword"
                  class="form-control"
                  placeholder="Tu contraseña"
                  v-model="loginForm.password"
                  required
              >
            </div>

            <button type="submit" class="btn-primary animate-input" style="animation-delay: 0.4s" :disabled="isLoading">
              <span v-if="!isLoading">Iniciar Sesión</span>
              <span v-else class="loading-text">
                <span class="loading-spinner"></span>
                Iniciando sesión...
              </span>
            </button>
          </form>

          <!-- Register Form -->
          <form v-else @submit.prevent="handleRegister" class="auth-form" key="register">
            <div class="form-section">
              <div class="form-group animate-input" style="animation-delay: 0.1s">
                <label for="registerFirstName">Nombres</label>
                <input
                    type="text"
                    id="registerFirstName"
                    class="form-control"
                    placeholder="Juan"
                    v-model="registerForm.firstName"
                    required
                >
              </div>

              <div class="form-group animate-input" style="animation-delay: 0.2s">
                <label for="registerLastName">Apellidos</label>
                <input
                    type="text"
                    id="registerLastName"
                    class="form-control"
                    placeholder="Pérez García"
                    v-model="registerForm.lastName"
                    required
                >
              </div>

              <div class="form-group animate-input" style="animation-delay: 0.3s">
                <label for="registerEmail">Email</label>
                <input
                    type="email"
                    id="registerEmail"
                    class="form-control"
                    placeholder="juan@empresa.com"
                    v-model="registerForm.email"
                    required
                >
              </div>

              <div class="form-group animate-input" style="animation-delay: 0.4s">
                <label for="registerPhone">Teléfono</label>
                <input
                    type="tel"
                    id="registerPhone"
                    class="form-control"
                    placeholder="+51 999 999 999"
                    v-model="registerForm.phone"
                    required
                >
              </div>

              <div class="form-group animate-input" style="animation-delay: 0.5s">
                <label for="registerPassword">Contraseña</label>
                <input
                    type="password"
                    id="registerPassword"
                    class="form-control"
                    placeholder="Crea tu contraseña"
                    v-model="registerForm.password"
                    required
                >
              </div>
            </div>

            <button type="submit" class="btn-primary animate-input" style="animation-delay: 0.6s" :disabled="isLoading">
              <span v-if="!isLoading">Crear Cuenta</span>
              <span v-else class="loading-text">
                <span class="loading-spinner"></span>
                Creando cuenta...
              </span>
            </button>
          </form>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import useIamStore from '../application/iam.store.js';
import { storeToRefs } from 'pinia';

const router = useRouter();
const iamStore = useIamStore();
const { errors } = storeToRefs(iamStore);

// Reactive state
const isLogin = ref(true);
const isLoading = ref(false);
const loginForm = ref({
  email: '',
  password: '',
});
const registerForm = ref({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
});

// Computed properties
const hasErrors = computed(() => {
  return errors.value && errors.value.length > 0;
});

const errorMessage = computed(() => {
  if (hasErrors.value) {
    return errors.value[errors.value.length - 1]?.message || 'Ha ocurrido un error';
  }
  return '';
});

// Methods
const switchToLogin = () => {
  isLogin.value = true;
  resetForms();
  clearErrors();
};

const switchToRegister = () => {
  isLogin.value = false;
  resetForms();
  clearErrors();
};

const resetForms = () => {
  loginForm.value = {
    email: '',
    password: '',
  };
  registerForm.value = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  };
};

const clearErrors = () => {
  if (iamStore.errors) {
    iamStore.errors = [];
  }
};

const handleLogin = async () => {
  isLoading.value = true;
  clearErrors();

  try {
    const signInCommand = {
      email: loginForm.value.email,
      password: loginForm.value.password
    };

    // Llamar a signIn del store (maneja la navegación internamente)
    iamStore.signIn(signInCommand, router);
    
    // Esperar un momento para que se complete la operación
    await new Promise(resolve => setTimeout(resolve, 1500));
  } catch (error) {
    console.error('Error en login:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = async () => {
  isLoading.value = true;
  clearErrors();

  try {
    const signUpCommand = {
      email: registerForm.value.email,
      password: registerForm.value.password,
      name: registerForm.value.firstName,
      surname: registerForm.value.lastName,
      phone: registerForm.value.phone
    };

    console.log('📝 Datos enviados al crear cuenta:', signUpCommand);
    console.log('📋 Formulario completo:', registerForm.value);

    // Llamar a signUp del store
    iamStore.signUp(signUpCommand);
    
    // Esperar un momento para que se complete la operación
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Si no hay errores, cambiar a la vista de login
    if (!hasErrors.value) {
      isLogin.value = true;
      resetForms();
    }
  } catch (error) {
    console.error('Error en registro:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* ===== ANIMACIONES ===== */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes checkmark {
  0% {
    transform: scale(0) rotate(-45deg);
  }
  50% {
    transform: scale(1.2) rotate(-45deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

/* Clases de animación */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-fade-in-delay {
  animation: fadeIn 0.8s ease-out 0.2s both;
}

.animate-fade-up {
  animation: fadeInUp 0.6s ease-out;
}

.animate-slide-in {
  animation: slideInLeft 0.5s ease-out both;
}

.animate-input {
  animation: fadeInUp 0.4s ease-out both;
}

.animate-title {
  animation: fadeInUp 0.5s ease-out;
}

.animate-subtitle {
  animation: fadeInUp 0.5s ease-out 0.1s both;
}

/* Transiciones de formularios */
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 0.3s ease;
}

.form-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.form-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Transiciones para campos condicionales */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Checkmark animado */
.checkmark-animated {
  display: inline-block;
  animation: checkmark 0.3s ease-out;
}

/* Loading spinner */
.loading-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}

.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ===== ESTILOS BASE ===== */
.auth-page {
  background: #f8fafc;
  min-height: 100vh;
  min-height: 100dvh; /* Soporte para viewport dinámico en móviles */
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow-x: hidden; /* Prevenir scroll horizontal */
}

.left-panel {
  background: #0E2948;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.brand-content {
  text-align: center;
  color: white;
  z-index: 2;
  max-width: 450px;
}

.brand-logo-placeholder {
  width: 120px;
  height: 120px;
  backdrop-filter: blur(20px);
  border-radius: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.brand-logo-placeholder:hover {
  transform: scale(1.05);
}

/* Cuando tengas tu logo, usa esto: */
.brand-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 20px;
}

.temp-logo {
  font-size: 24px;
  font-weight: 700;
  color: white;
  letter-spacing: 2px;
}

.brand-content h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #ffffff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-content p {
  font-size: 18px;
  opacity: 0.8;
  line-height: 1.6;
  margin-bottom: 32px;
  color: #cbd5e1;
}

.features {
  display: grid;
  gap: 16px;
  text-align: left;
}

.feature {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  color: #e2e8f0;
  transition: transform 0.2s ease;
}

.feature:hover {
  transform: translateX(5px);
}

.feature-icon {
  width: 32px;
  height: 32px;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.feature:hover .feature-icon {
  background: rgba(59, 130, 246, 0.25);
  transform: scale(1.1);
}

.right-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: white;
  overflow-y: auto; /* Permitir scroll si el contenido es muy largo */
  -webkit-overflow-scrolling: touch; /* Scroll suave en iOS */
}

.auth-container {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}

.auth-form {
  width: 100%;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.auth-header p {
  color: #6b7280;
  font-size: 16px;
}

.auth-tabs {
  display: flex;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 6px;
  margin-bottom: 32px;
  position: relative;
}

.auth-tab {
  flex: 1;
  padding: 12px 24px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #64748b;
  position: relative;
  z-index: 2;
}

.auth-tab:hover {
  color: #475569;
}

.auth-tab.active {
  color: #1e293b;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: scale(1.02);
}

.form-section {
  margin-bottom: 24px;
}

.section-label {
  margin-bottom: 12px;
  display: block;
  font-weight: 600;
  color: #374151;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 500;
  font-size: 14px;
  transition: color 0.2s ease;
}

.form-control {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fff;
}

.form-control:hover {
  border-color: #cbd5e1;
}

.form-control:focus {
  outline: none;
  border-color: #1e293b;
  box-shadow: 0 0 0 4px rgba(30, 41, 59, 0.1);
  transform: translateY(-1px);
}

.form-control::placeholder {
  color: #9ca3af;
}

.user-type-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.user-type-card {
  padding: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fff;
  position: relative;
}

.user-type-card:hover {
  border-color: #cbd5e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.user-type-card.selected {
  border-color: #1e293b;
  background: #f8fafc;
  transform: scale(1.02);
}

.user-type-card.selected::before {
  content: '✓';
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #1e293b;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  animation: checkmark 0.3s ease-out;
}

.user-type-icon {
  font-size: 28px;
  margin-bottom: 8px;
  transition: transform 0.3s ease;
}

.user-type-card:hover .user-type-icon {
  transform: scale(1.1);
}

.user-type-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.user-type-desc {
  font-size: 12px;
  color: #6b7280;
}

.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  margin-top: 2px;
}

.custom-checkbox:hover {
  border-color: #9ca3af;
  transform: scale(1.1);
}

.custom-checkbox.checked {
  background: #1e293b;
  border-color: #1e293b;
  color: white;
}

.checkbox-label {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
  cursor: pointer;
  transition: color 0.2s ease;
}

.checkbox-label:hover {
  color: #1f2937;
}

.checkbox-label a {
  color: #1e293b;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.checkbox-label a:hover {
  text-decoration: underline;
  color: #0f172a;
}

.btn-primary {
  width: 100%;
  padding: 14px 24px;
  background: #1e293b;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 8px;
}

.btn-primary:hover:not(:disabled) {
  background: #0f172a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 41, 59, 0.3);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.forgot-password {
  text-align: center;
}

.forgot-password a {
  color: #1e293b;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  position: relative;
}

.forgot-password a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #1e293b;
  transition: width 0.3s ease;
}

.forgot-password a:hover::after {
  width: 100%;
}

.forgot-password a:hover {
  color: #0f172a;
}

/* Error Message Styles */
.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;
  font-size: 14px;
  margin-bottom: 20px;
  animation: slideDown 0.3s ease-out;
}

.error-icon {
  font-size: 18px;
  flex-shrink: 0;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== MEDIA QUERIES - RESPONSIVE DESIGN ===== */

/* Tablet y pantallas medianas (768px - 1024px) */
@media (max-width: 1024px) {
  .auth-page {
    grid-template-columns: 1fr;
  }

  .left-panel {
    display: none;
  }

  .right-panel {
    min-height: 100vh;
    padding: 32px 24px;
  }

  .auth-container {
    max-width: 480px;
  }

  .auth-header h2 {
    font-size: 26px;
  }

  .auth-header p {
    font-size: 15px;
  }

  .auth-tabs {
    margin-bottom: 28px;
  }

  .auth-tab {
    padding: 10px 20px;
    font-size: 15px;
  }
}

/* Tablets pequeñas y móviles grandes (481px - 768px) */
@media (max-width: 768px) {
  .right-panel {
    padding: 24px 20px;
    justify-content: flex-start;
    padding-top: 40px;
  }

  .auth-container {
    max-width: 100%;
    width: 100%;
  }

  .auth-header {
    margin-bottom: 24px;
  }

  .auth-header h2 {
    font-size: 24px;
  }

  .auth-header p {
    font-size: 14px;
  }

  .auth-tabs {
    margin-bottom: 24px;
    padding: 4px;
  }

  .auth-tab {
    padding: 10px 16px;
    font-size: 14px;
  }

  .form-group {
    margin-bottom: 18px;
  }

  .form-control {
    padding: 12px 14px;
    font-size: 16px; /* Previene zoom en iOS */
  }

  .form-group label {
    font-size: 13px;
    margin-bottom: 6px;
  }

  .btn-primary {
    padding: 12px 20px;
    font-size: 15px;
  }

  .form-section {
    margin-bottom: 20px;
  }
}

/* Móviles pequeños y medianos (320px - 480px) */
@media (max-width: 480px) {
  .auth-page {
    background: white;
  }

  .right-panel {
    padding: 20px 16px;
    padding-top: 32px;
    background: white;
  }

  .auth-container {
    max-width: 100%;
  }

  .auth-header {
    margin-bottom: 20px;
  }

  .auth-header h2 {
    font-size: 22px;
    margin-bottom: 6px;
  }

  .auth-header p {
    font-size: 13px;
  }

  .auth-tabs {
    margin-bottom: 20px;
    padding: 4px;
    border-radius: 10px;
  }

  .auth-tab {
    padding: 10px 12px;
    font-size: 13px;
    border-radius: 6px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-control {
    padding: 12px 14px;
    font-size: 16px; /* Previene zoom automático en iOS */
    border-radius: 8px;
    border-width: 1.5px;
  }

  .form-control:focus {
    box-shadow: 0 0 0 3px rgba(30, 41, 59, 0.08);
    transform: none; /* Eliminar transform en móvil para mejor UX */
  }

  .form-group label {
    font-size: 12px;
    margin-bottom: 6px;
  }

  .btn-primary {
    padding: 14px 20px;
    font-size: 15px;
    border-radius: 8px;
    margin-top: 4px;
    /* Área táctil más grande en móviles */
    min-height: 48px;
  }

  .btn-primary:hover:not(:disabled) {
    transform: none; /* Eliminar hover effects en móvil */
  }

  .form-section {
    margin-bottom: 16px;
  }

  /* Mejorar espaciado en formularios largos */
  .auth-form {
    padding-bottom: 20px;
  }

  /* Ajustar animaciones para móviles */
  .animate-input {
    animation-duration: 0.3s;
  }
}

/* Móviles muy pequeños (hasta 360px) */
@media (max-width: 360px) {
  .right-panel {
    padding: 16px 12px;
    padding-top: 24px;
  }

  .auth-header h2 {
    font-size: 20px;
  }

  .auth-header p {
    font-size: 12px;
  }

  .auth-tab {
    padding: 8px 10px;
    font-size: 12px;
  }

  .form-control {
    padding: 10px 12px;
    font-size: 16px;
  }

  .btn-primary {
    padding: 12px 16px;
    font-size: 14px;
  }
}

/* Orientación landscape en móviles */
@media (max-width: 768px) and (orientation: landscape) {
  .right-panel {
    padding: 16px 20px;
    justify-content: center;
  }

  .auth-header {
    margin-bottom: 16px;
  }

  .auth-header h2 {
    font-size: 20px;
  }

  .form-group {
    margin-bottom: 12px;
  }

  .form-section {
    margin-bottom: 12px;
  }
}

/* Pantallas muy grandes (más de 1440px) */
@media (min-width: 1440px) {
  .auth-container {
    max-width: 480px;
  }

  .left-panel {
    padding: 60px;
  }

  .brand-content {
    max-width: 500px;
  }

  .brand-content h1 {
    font-size: 42px;
  }

  .brand-content p {
    font-size: 20px;
  }
}

/* Mejoras de accesibilidad táctil */
@media (hover: none) and (pointer: coarse) {
  /* Dispositivos táctiles */
  .auth-tab {
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-primary {
    min-height: 48px;
  }

  .form-control {
    min-height: 44px;
  }

  /* Eliminar efectos hover en dispositivos táctiles */
  .form-control:hover {
    border-color: #e5e7eb;
  }

  .auth-tab:hover {
    color: #64748b;
  }
}

/* Prevenir zoom en inputs en iOS */
@supports (-webkit-touch-callout: none) {
  @media (max-width: 768px) {
    .form-control {
      font-size: 16px !important;
    }
  }
}
</style>