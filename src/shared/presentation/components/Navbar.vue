<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <div class="logo-container">
        <img src="../../../assets/rutana-logo.png" alt="Rutana Logo" class="logo-img" />
        <span class="logo-text">Rutana</span>
      </div>
    </div>

    <!-- Boton para responsive-->
    <button class="hamburger" @click="toggleMenu" :class="{ active: isMenuOpen }">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Navegación responsivee -->
    <ul class="nav-menu" :class="{ 'menu-open': isMenuOpen }">
      <li :class="{ active: currentTab === 'Deliveries' }" @click="selectTab('Deliveries')">
        <span class="nav-icon">📦</span>
        Deliveries
      </li>
      <li :class="{ active: currentTab === 'Users' }" @click="selectTab('Users')">
        <span class="nav-icon">👥</span>
        Users
      </li>
      <li :class="{ active: currentTab === 'Clients' }" @click="selectTab('Clients')">
        <span class="nav-icon">🏢</span>
        Clients
      </li>
      <li :class="{ active: currentTab === 'Vehicles' }" @click="selectTab('Vehicles')">
        <span class="nav-icon">🚗</span>
        Vehicles
      </li>
      <li :class="{ active: currentTab === 'Routes' }" @click="selectTab('Routes')">
        <span class="nav-icon">🗺️</span>
        Routes
      </li>
      <li :class="{ active: currentTab === 'Locations' }" @click="selectTab('Locations')">
        <span class="nav-icon">📍</span>
        Locations
      </li>
    </ul>

    <div class="navbar-actions">
      <button class="btn-lang" @click="toggleLanguage">
        {{ locale === 'en' ? 'EN' : 'ES' }}
      </button>
      <div class="user-info" v-if="userDisplayName">
        <span class="user-name">{{ userDisplayName }}</span>
      </div>
      <button class="btn-logout" @click="handleLogout">
        <span class="logout-icon">🚪</span>
        <span class="logout-text">Salir</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import useIamStore from "../../../iam/presentation/application/iam.store.js"
import { storeToRefs } from "pinia"

const props = defineProps({
  currentTab: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['updateTab'])

const router = useRouter()
const iamStore = useIamStore()
const { currentUserName, currentUserSurname } = storeToRefs(iamStore)

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const selectTab = (tab) => {
  emit('updateTab', tab)
  isMenuOpen.value = false // Cerrar menú al seleccionar
}

const { locale } = useI18n()
const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'es' : 'en'
  localStorage.setItem('lang', locale.value)
}

const userDisplayName = computed(() => {
  if (currentUserName.value && currentUserSurname.value) {
    return `${currentUserName.value} ${currentUserSurname.value}`
  } else if (currentUserName.value) {
    return currentUserName.value
  }
  return ''
})

const handleLogout = () => {
  iamStore.signOut(router)
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #043873;
  color: white;
  padding: 0 30px;
  height: 60px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 100;
}

.navbar-brand {
  display: flex;
  align-items: center;
  z-index: 101;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.logo-container:hover {
  transform: scale(1.05);
}

.logo-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.logo-text {
  letter-spacing: 0.5px;
  font-size: 20px;
}

/* Hamburger menu */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 101;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background: white;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

/* Navigation menu */
.nav-menu {
  display: flex;
  gap: 0;
  list-style: none;
  flex: 1;
  justify-content: center;
  margin: 0 40px;
}

.nav-menu li {
  padding: 20px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 400;
  font-size: 15px;
  position: relative;
  color: rgba(255, 255, 255, 0.85);
  height: 60px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-icon {
  display: none;
  font-size: 18px;
}

.nav-menu li:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.nav-menu li.active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 500;
}

.nav-menu li.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #ffd700;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 101;
}

.btn-lang {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-lang:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.user-info {
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.user-name {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
}

.btn-logout {
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(220, 53, 69, 0.3);
}

.btn-logout:hover {
  background: rgba(220, 53, 69, 1);
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(220, 53, 69, 0.4);
}

.logout-icon {
  font-size: 16px;
}

.logout-text {
  display: inline-block;
}

@media (max-width: 768px) {
  .logout-text {
    display: none;
  }
  
  .user-name {
    display: none;
  }
  
  .btn-logout {
    padding: 8px 12px;
  }
}

/* Tablet */
@media (max-width: 1200px) {
  .nav-menu {
    gap: 2px;
    margin: 0 20px;
  }

  .nav-menu li {
    padding: 20px 14px;
    font-size: 13px;
  }

  .logo-text {
    font-size: 18px;
  }
}

/* Tablet */
@media (max-width: 1024px) {
  .nav-menu li {
    padding: 20px 12px;
    font-size: 13px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .navbar {
    padding: 0 20px;
    height: 60px;
  }

  .hamburger {
    display: flex;
  }

  .nav-menu {
    position: fixed;
    top: 60px;
    right: -100%;
    width: 280px;
    height: calc(100vh - 60px);
    background: #1e4976;
    flex-direction: column;
    gap: 0;
    margin: 0;
    padding: 20px 0;
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.2);
    transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
  }

  .nav-menu.menu-open {
    right: 0;
  }

  .nav-menu li {
    width: 100%;
    height: auto;
    padding: 16px 24px;
    font-size: 16px;
    border-left: 3px solid transparent;
  }

  .nav-icon {
    display: inline-block;
  }

  .nav-menu li:hover {
    background: rgba(255, 255, 255, 0.08);
    border-left-color: rgba(255, 215, 0, 0.5);
  }

  .nav-menu li.active {
    background: rgba(255, 255, 255, 0.15);
    border-left-color: #ffd700;
  }

  .nav-menu li.active::after {
    display: none;
  }

  .btn-lang {
    padding: 6px 10px;
    font-size: 12px;
  }

  .btn-logout {
    padding: 8px 12px;
    font-size: 13px;
  }

  .logo-text {
    display: none;
  }

  .logo-img {
    width: 36px;
    height: 36px;
  }
}

/* Very small screens */
@media (max-width: 480px) {
  .navbar {
    padding: 0 15px;
  }

  .nav-menu {
    width: 100%;
    right: -100%;
  }

  .btn-lang {
    padding: 5px 8px;
    font-size: 11px;
  }

  .btn-logout {
    padding: 6px 10px;
    font-size: 12px;
  }
}
</style>