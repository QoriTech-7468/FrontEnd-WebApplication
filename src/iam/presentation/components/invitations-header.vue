<template>
  <header class="topbar">
    <div class="topbar-right">
      <!-- Botón Purchase -->
      <button class="btn-purchase" @click="$emit('open-purchase-modal')">
        Purchase
      </button>

      <!-- Botón Usuario con desplegable -->
      <div class="user-dropdown">
        <button class="btn-user" @click="toggleUserMenu">
          {{ userName }}
          <span class="arrow">▼</span>
        </button>

        <div v-if="isUserMenuOpen" class="dropdown-menu">
          <button class="dropdown-item" @click="handleSignOut">
            Sign out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import useIamStore from '../../application/iam.store.js'
import { storeToRefs } from 'pinia'

defineEmits(['open-purchase-modal'])

const router = useRouter()
const iamStore = useIamStore()
const { currentUserName, currentUserSurname } = storeToRefs(iamStore)

const isUserMenuOpen = ref(false)

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const handleSignOut = () => {
  iamStore.signOut(router)
}

const userName = computed(() => {
  if (currentUserName.value && currentUserSurname.value) {
    return `${currentUserName.value} ${currentUserSurname.value}`
  } else if (currentUserName.value) {
    return currentUserName.value
  }
  return 'User'
})
</script>

<style scoped>
.topbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 60px;
  background: #043873;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 30px;
  z-index: 200;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-purchase {
  background: #ffffff;
  color: #043873;
  border: none;
  padding: 8px 20px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-purchase:hover {
  background: #e6e6e6;
}

.btn-user {
  background: #ffd700;
  color: #1e4976;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(255, 215, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-user:hover {
  background: #ffed4e;
}

.user-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 110%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  min-width: 140px;
  overflow: hidden;
  z-index: 300;
}

.dropdown-item {
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-item:hover {
  background: #f2f2f2;
}
</style>

