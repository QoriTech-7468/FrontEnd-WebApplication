<template>
  import { useRouter } from 'vue-router';
  const router = useRouter();

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
        <p class="animate-fade-in-delay">The most complete web platform for carriers and logistics companies in Peru</p>

        <div class="features">
          <div class="feature animate-slide-in" style="animation-delay: 0.1s">
            <div class="feature-icon">📋</div>
            <span>Complete management of routes and orders</span>
          </div>
          <div class="feature animate-slide-in" style="animation-delay: 0.2s">
            <div class="feature-icon">📍</div>
            <span>Real-time GPS tracking</span>
          </div>
          <div class="feature animate-slide-in" style="animation-delay: 0.3s">
            <div class="feature-icon">💼</div>
            <span>Advanced admin panel</span>
          </div>
          <div class="feature animate-slide-in" style="animation-delay: 0.4s">
            <div class="feature-icon">📊</div>
            <span>Detailed reports and analytics</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel - Authentication -->
    <div class="right-panel">
      <div class="auth-container animate-fade-up">
        <div class="auth-header">
          <h2 class="animate-title">{{ isLogin ? 'Log In' : 'Create Account' }}</h2>
          <p class="animate-subtitle">{{ isLogin ? 'Access your Rutana account' : 'Join the Rutana platform' }}</p>
        </div>

        <div class="auth-tabs">
          <div
              class="auth-tab"
              :class="{ active: isLogin }"
              @click="switchToLogin"
          >
            Log In
          </div>
          <div
              class="auth-tab"
              :class="{ active: !isLogin }"
              @click="switchToRegister"
          >
            Create Account
          </div>
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
              <label for="loginPassword">Password</label>
              <input
                  type="password"
                  id="loginPassword"
                  class="form-control"
                  placeholder="Your password"
                  v-model="loginForm.password"
                  required
              >
            </div>



            <button type="submit" class="btn-rutana animate-input" style="animation-delay: 0.4s" :disabled="isLoading">
              <span v-if="!isLoading">Log In</span>
              <span v-else class="loading-text">
                <span class="loading-spinner"></span>
                Signing in...
              </span>
            </button>


          </form>

          <!-- Register Form -->
          <form v-else @submit.prevent="handleRegister" class="auth-form" key="register">


            <div class="form-section">
              <div class="form-group animate-input" style="animation-delay: 0.2s">
                <label for="registerName">Name</label>
                <input
                    type="text"
                    id="registerName"
                    class="form-control"
                    placeholder="Juan"
                    v-model="registerForm.name"
                    required
                >
              </div>

              <div class="form-group animate-input" style="animation-delay: 0.3s">
                <label for="registerEmail">Last Name</label>
                <input
                    type="text"
                    id="registerName"
                    class="form-control"
                    placeholder="Pérez García"
                    v-model="registerForm.lastname"
                    required
                >
              </div>

              <div class="form-row animate-input" style="animation-delay: 0.4s">
                <div class="form-group">
                  <label for="registerPhone">Phone</label>
                  <input
                      type="tel"
                      id="registerPhone"
                      class="form-control"
                      placeholder="+51 999 999 999"
                      v-model="registerForm.phone"
                      required
                  >
                </div>
                <div class="form-group">
                  <label for="companyName">Company</label>
                  <input
                      type="text"
                      id="companyName"
                      class="form-control"
                      placeholder="Company name"
                      v-model="registerForm.company"
                      required
                  >
                </div>
              </div>

              <!-- Campos específicos por tipo de usuario -->
              <transition name="slide-fade">
                <div v-if="registerForm.userType === 'transportista'" class="form-group animate-input" style="animation-delay: 0.5s">
                  <label for="dniTransportista">Email</label>
                  <input
                      type="email"
                      id="registerEmail"
                      class="form-control"
                      placeholder="juan@empresa.com"
                      v-model="registerForm.email"
                      required
                  >
                </div>
              </transition>

              <transition name="slide-fade">
                <div v-if="registerForm.userType === 'cliente'" class="form-group animate-input" style="animation-delay: 0.5s">
                  <label for="rucEmpresa">RUC</label>
                  <input
                      type="text"
                      id="rucEmpresa"
                      class="form-control"
                      placeholder="20123456789"
                      v-model="registerForm.ruc"
                      maxlength="11"
                      @input="validateRUC"
                      required
                  >
                </div>
              </transition>

              <div class="form-group animate-input" style="animation-delay: 0.6s">
                <label for="registerPassword">Password</label>
                <input
                    type="password"
                    id="registerPassword"
                    class="form-control"
                    placeholder="Create your password"
                    v-model="registerForm.password"
                    required
                >
              </div>
            </div>
            <div class="form-group animate-input" style="animation-delay: 0.1s">
              <div class="checkbox-wrapper">
                <div
                    class="custom-checkbox"
                    :class="{ checked: registerForm.ownCompany }"
                    @click="registerForm.ownCompany = !registerForm.ownCompany"
                >
                  <span v-if="registerForm.ownCompany" class="checkmark-animated">✓</span>
                </div>
                <label
                    class="checkbox-label"
                    @click="registerForm.ownCompany = !registerForm.ownCompany"
                >
                  I own a company
                </label>
              </div>
            </div>

            <!-- Formulario desplegable (solo si ownCompany = true) -->
            <transition name="slide-fade">
              <div v-if="registerForm.ownCompany" class="pl-8 space-y-4">
                <div class="form-group">
                  <label for="companyNameInput">Company’s name</label>
                  <input
                      type="text"
                      id="companyNameInput"
                      class="form-control"
                      placeholder="Enter the company's name"
                      v-model="registerForm.companyName"
                      required
                  >
                  <p class="text-xs text-red-500 mt-1" v-if="!registerForm.companyName && registerForm.ownCompany">
                    This field is required
                  </p>
                </div>

                <div class="form-group">
                  <label for="rucInput">RUC</label>
                  <input
                      type="text"
                      id="rucInput"
                      class="form-control"
                      placeholder="Enter RUC number"
                      v-model="registerForm.companyRuc"
                      maxlength="11"
                      @input="validateCompanyRUC"
                      required
                  >
                  <p class="text-xs text-red-500 mt-1" v-if="!registerForm.companyRuc && registerForm.ownCompany">
                    This field is required
                  </p>
                </div>

                <div class="form-group">
                  <label for="planSelect">Select the plan</label>
                  <select
                      id="planSelect"
                      class="form-control"
                      v-model="registerForm.plan"
                      required
                  >
                    <option value="" disabled>Plan</option>
                    <option value="economic">Starter Plan</option>
                    <option value="professional">Professional Plan</option>
                    <option value="enterprise">Enterprise Plan</option>
                  </select>
                </div>
              </div>
            </transition>



            <div class="checkbox-wrapper animate-input" style="animation-delay: 0.7s">
              <div
                  class="custom-checkbox"
                  :class="{ checked: registerForm.acceptTerms }"
                  @click="registerForm.acceptTerms = !registerForm.acceptTerms"
              >
                <span v-if="registerForm.acceptTerms" class="checkmark-animated">✓</span>
              </div>
              <label
                  class="checkbox-label"
                  @click="registerForm.acceptTerms = !registerForm.acceptTerms"
              >
                Acepto los <a href="#" @click.prevent>términos y condiciones</a>
              </label>
            </div>

            <button type="submit" class="btn-rutana animate-input" style="animation-delay: 0.8s" :disabled="isLoading || !registerForm.acceptTerms">
              <span v-if="!isLoading">Create Account</span>
              <span v-else class="loading-text">
                <span class="loading-spinner"></span>
                Creating account ...
              </span>
            </button>
          </form>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginRegister',
  data() {
    return {
      isLogin: true,
      isLoading: false,
      loginForm: {
        email: '',
        password: '',
        rememberMe: false
      },
      registerForm: {
        userType: 'transportista',
        name: '',
        lastname: '',
        phone: '',
        company: '',
        email: '',
        ruc: '',
        password: '',
        acceptTerms: false,
        ownCompany: false,
        companyName: '',
        companyRuc: '',
        plan: ''
      }
    }
  },
  methods: {
    switchToLogin() {
      this.isLogin = true;
      this.resetForms();
    },

    switchToRegister() {
      this.isLogin = false;
      this.resetForms();
    },

    resetForms() {
      this.loginForm = {
        email: '',
        password: '',
        rememberMe: false
      };
      this.registerForm = {
        userType: 'transportista',
        name: '',
        lastname: '',
        phone: '',
        company: '',
        email: '',
        ruc: '',
        password: '',
        acceptTerms: false
      };
    },

    selectUserType(type) {
      this.registerForm.userType = type;
      this.registerForm.dni = '';
      this.registerForm.ruc = '';
    },

    async handleLogin() {
      this.isLoading = true;

      try {
        // simulación de llamada al servidor
        await new Promise(resolve => setTimeout(resolve, 600));

        const { email, password } = this.loginForm;
        console.log('[DEBUG] loginAttempt', { email, password });

        // uso de credenciales hardcoded para el caso de prueba
        if (email === 'yaku@hotmail.com' && password === '1238') {
          const role = 'Driver'; // /simulación: role viene del backend

          if (role === 'Driver') {
            console.log('[DEBUG] role Driver -> redirigiendo a /invitations');
            this.$router.push({ name: 'invitations' });
            return;
          }

          // Para otros roles:
          this.$router.push({ name: 'layout' });
          return;
        }

        // credenciales incorrectas
        alert('Credenciales incorrectas');
        console.warn('[WARN] Credenciales incorrectas', { email });

      } catch (err) {
        console.error('[ERROR] handleLogin', err);
      } finally {
        this.isLoading = false;
      }
    },

    async handleRegister() {
      if (this.registerForm.userType === 'transportista') {
        if (this.registerForm.dni.length !== 8) {
          alert('El DNI debe tener 8 dígitos');
          return;
        }
      } else {
        if (this.registerForm.ruc.length !== 11) {
          alert('El RUC debe tener 11 dígitos');
          return;
        }
      }

      this.isLoading = true;

      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Register data:', this.registerForm);
        this.$router.push('/layout');
      } catch (error) {
        console.error('Error en registro:', error);
      } finally {
        this.isLoading = false;
      }
    },

    handleForgotPassword() {
      this.$emit('forgot-password');
    },

    validateDNI(event) {
      this.registerForm.dni = event.target.value.replace(/\D/g, '').substring(0, 8);
    },

    validateRUC(event) {
      this.registerForm.ruc = event.target.value.replace(/\D/g, '').substring(0, 11);
    }
  }
}
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
  display: grid;
  grid-template-columns: 1fr 1fr;
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
}

.auth-container {
  width: 100%;
  max-width: 420px;
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

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(255, 214, 10, 0.3);
}

.btn-primary:disabled {
  background: #ffd60a;
  color: #043873;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  box-shadow: 0 2px 8px rgba(255, 214, 10, 0.3);
  width: 100%;
  text-align: center;
  position: relative;
  overflow: hidden;
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
.btn-rutana {
  background: #ffd60a;
  color: #043873;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  box-shadow: 0 2px 8px rgba(255, 214, 10, 0.3);
  width: 100%;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-top: 8px;
}

.btn-rutana:hover:not(:disabled) {
  background: #fbbf24;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 214, 10, 0.4);
}

.btn-rutana:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(255, 214, 10, 0.3);
}

.btn-rutana:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Spinner: ahora en azul oscuro (#043873) para contraste */
.btn-rutana .loading-spinner {
  border: 2px solid rgba(4, 56, 115, 0.3);
  border-top-color: #043873;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  vertical-align: middle;
}

/* Media Queries */
@media (max-width: 1024px) {
  .auth-page {
    grid-template-columns: 1fr;
  }

  .left-panel {
    display: none;
  }

  .right-panel {
    min-height: 100vh;
  }
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .user-type-grid {
    grid-template-columns: 1fr;
  }

  .right-panel {
    padding: 20px;
  }

  .auth-container {
    max-width: 100%;
  }

  .brand-logo-placeholder {
    width: 100px;
    height: 100px;
  }

  .brand-content h1 {
    font-size: 28px;
  }

  .brand-content p {
    font-size: 16px;
  }
}
</style>