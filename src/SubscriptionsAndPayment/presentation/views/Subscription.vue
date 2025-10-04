<template>
  <div class="create-account-page">
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

    <!-- Right Panel - Form -->
    <div class="right-panel">
      <div class="form-container animate-fade-up">
        <div class="form-header">
          <h2>Suscríbete</h2>
          <p class="subtitle">Gestiona toda tu compañia</p>
        </div>

        <form @submit.prevent="handleSubscribe" class="subscription-form">
          <!-- Full Name -->
          <div class="form-group animate-input" style="animation-delay: 0.1s">
            <label for="fullName">Nombre Completo</label>
            <input
                type="text"
                id="fullName"
                v-model="formData.fullName"
                placeholder="Ingresa tu nombre"
                class="form-control"
                required
            >
            <span class="field-hint">Este campo es obligatorio</span>
          </div>

          <!-- Email -->
          <div class="form-group animate-input" style="animation-delay: 0.2s">
            <label for="email">Email</label>
            <input
                type="email"
                id="email"
                v-model="formData.email"
                placeholder="Ingresa tu Email"
                class="form-control"
                required
            >
            <span class="field-hint">Este campo es obligatorio</span>
          </div>

          <!-- Phone & Company -->
          <div class="form-row animate-input" style="animation-delay: 0.3s">
            <div class="form-group">
              <label for="phone">Celular</label>
              <input
                  type="tel"
                  id="phone"
                  v-model="formData.phone"
                  placeholder="000 000 000"
                  class="form-control"
                  required
              >
            </div>
            <div class="form-group">
              <label for="company">Compañia</label>
              <input
                  type="text"
                  id="company"
                  v-model="formData.company"
                  placeholder="Nombre de la compañia"
                  class="form-control"
                  required
              >
            </div>
          </div>

          <!-- RUC -->
          <div class="form-group animate-input" style="animation-delay: 0.4s">
            <label for="ruc">RUC</label>
            <input
                type="text"
                id="ruc"
                v-model="formData.ruc"
                placeholder="Ingresa tu RUC"
                class="form-control"
                maxlength="11"
                @input="validateRUC"
                required
            >
            <span class="field-hint">Este campo es obligatorio</span>
          </div>

          <!-- Card Number & CVV -->
          <div class="form-row animate-input" style="animation-delay: 0.5s">
            <div class="form-group">
              <label for="cardNumber">Tarjeta</label>
              <input
                  type="text"
                  id="cardNumber"
                  v-model="formData.cardNumber"
                  placeholder="XXXX XXXX XXXX XXXX"
                  class="form-control"
                  maxlength="19"
                  @input="formatCardNumber"
                  required
              >
              <span class="field-hint">Este campo es obligatorio</span>
            </div>
            <div class="form-group">
              <label for="cvv">CVV</label>
              <input
                  type="text"
                  id="cvv"
                  v-model="formData.cvv"
                  placeholder="XXX"
                  class="form-control"
                  maxlength="3"
                  @input="validateCVV"
                  required
              >
              <span class="field-hint">Este campo es obligatorio</span>
            </div>
          </div>

          <!-- Plan Selection -->
          <div class="form-group animate-input" style="animation-delay: 0.6s">
            <label class="plan-label">Selecciona tu plan</label>
            <div class="plan-options">
              <label class="plan-option" :class="{ selected: formData.plan === 'free' }">
                <input type="radio" v-model="formData.plan" value="free" />
                <span class="plan-name">Gratis</span>
              </label>
              <label class="plan-option" :class="{ selected: formData.plan === 'professional' }">
                <input type="radio" v-model="formData.plan" value="professional" />
                <span class="plan-name">Plan Profesional</span>
              </label>
              <label class="plan-option" :class="{ selected: formData.plan === 'enterprise' }">
                <input type="radio" v-model="formData.plan" value="enterprise" />
                <span class="plan-name">Plan Empresarial</span>
              </label>
            </div>
          </div>

          <!-- Password -->
          <div class="form-group animate-input" style="animation-delay: 0.7s">
            <label for="password">Contraseña</label>
            <div class="password-wrapper">
              <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="formData.password"
                  placeholder="Contraseña"
                  class="form-control"
                  required
              >
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <span class="field-hint">Este campo es obligatorio</span>
          </div>

          <!-- Terms -->
          <div class="checkbox-wrapper animate-input" style="animation-delay: 0.8s">
            <div
                class="custom-checkbox"
                :class="{ checked: formData.acceptTerms }"
                @click="formData.acceptTerms = !formData.acceptTerms"
            >
              <span v-if="formData.acceptTerms" class="checkmark-animated">✓</span>
            </div>
            <label
                class="checkbox-label"
                @click="formData.acceptTerms = !formData.acceptTerms"
            >
              Acepto los Términos y Condiciones
            </label>
          </div>

          <!-- Submit Button -->
          <button
              type="submit"
              class="btn-subscribe animate-input"
              style="animation-delay: 0.9s"
              :disabled="isLoading || !formData.acceptTerms"
          >
            <span v-if="!isLoading">Suscribirse</span>
            <span v-else class="loading-text">
              <span class="loading-spinner"></span>
              Processing...
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showPassword = ref(false)
const isLoading = ref(false)

const formData = ref({
  fullName: '',
  email: '',
  phone: '',
  company: '',
  ruc: '',
  cardNumber: '',
  cvv: '',
  plan: 'free',
  password: '',
  acceptTerms: false
})

const validateRUC = (event) => {
  formData.value.ruc = event.target.value.replace(/\D/g, '').substring(0, 11)
}

const formatCardNumber = (event) => {
  let value = event.target.value.replace(/\s/g, '').replace(/\D/g, '')
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
  formData.value.cardNumber = formattedValue.substring(0, 19)
}

const validateCVV = (event) => {
  formData.value.cvv = event.target.value.replace(/\D/g, '').substring(0, 3)
}

const handleSubscribe = async () => {
  if (formData.value.ruc.length !== 11) {
    alert('RUC must have 11 digits')
    return
  }

  if (formData.value.cardNumber.replace(/\s/g, '').length !== 16) {
    alert('Card number must have 16 digits')
    return
  }

  if (formData.value.cvv.length !== 3) {
    alert('CVV must have 3 digits')
    return
  }

  isLoading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Subscription data:', formData.value)
    alert('Subscription successful!')
    // Aquí iría la redirección
    // this.$router.push('/dashboard')
  } catch (error) {
    console.error('Error in subscription:', error)
    alert('Error processing subscription')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* ===== ANIMACIONES ===== */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
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
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes checkmark {
  0% { transform: scale(0) rotate(-45deg); }
  50% { transform: scale(1.2) rotate(-45deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
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

.checkmark-animated {
  display: inline-block;
  animation: checkmark 0.3s ease-out;
}

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
.create-account-page {
  background: #f8fafc;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

/* ===== LEFT PANEL ===== */
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

.brand-logo-container {
  margin-bottom: 24px;
  animation: pulse 2s ease-in-out infinite;
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

.brand-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 20px;
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

/* ===== RIGHT PANEL ===== */
.right-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: white;
  overflow-y: auto;
}

.form-container {
  width: 100%;
  max-width: 480px;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.subtitle {
  color: #6b7280;
  font-size: 16px;
}

.subscription-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label,
.plan-label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 600;
  font-size: 14px;
}

.form-control {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #fff;
}

.form-control:hover {
  border-color: #cbd5e1;
}

.form-control:focus {
  outline: none;
  border-color: #1e293b;
  box-shadow: 0 0 0 4px rgba(30, 41, 59, 0.1);
}

.form-control::placeholder {
  color: #9ca3af;
}

.field-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #9ca3af;
  margin-top: 6px;
}

.field-hint::before {
  content: 'ⓘ';
  font-size: 14px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  transition: transform 0.2s ease;
}

.toggle-password:hover {
  transform: translateY(-50%) scale(1.1);
}

/* Plan Options */
.plan-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.plan-option {
  flex: 1;
  min-width: 140px;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.plan-option input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #1e293b;
}

.plan-name {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.plan-option:hover {
  border-color: #cbd5e1;
  background: #f9fafb;
}

.plan-option.selected {
  border-color: #1e293b;
  background: #f8fafc;
}

/* Checkbox */
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
  transition: all 0.3s ease;
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
}

/* Submit Button */
.btn-subscribe {
  width: 100%;
  padding: 16px;
  background: #ffd700;
  color: #1e293b;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.btn-subscribe:hover:not(:disabled) {
  background: #ffed4e;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
}

.btn-subscribe:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Responsive */
@media (max-width: 1024px) {
  .create-account-page {
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

  .plan-options {
    flex-direction: column;
  }

  .plan-option {
    min-width: 100%;
  }

  .right-panel {
    padding: 20px;
  }
}
</style>