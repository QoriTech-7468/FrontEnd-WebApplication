<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  routeDraft: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const { t } = useI18n()

const handleClick = () => {
  // Navigate to edit route draft with query parameter to indicate it's a draft
  router.push({ 
    name: 'route-edit', 
    params: { routeId: props.routeDraft.id },
    query: { type: 'draft' }
  })
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return 'Invalid Date'
  }
}
</script>

<template>
  <button class="route-draft-card" @click="handleClick">
    <div class="route-draft-info">
      <div class="flex align-items-center gap-2 mb-2">
        <div class="text-900 text-lg font-semibold">
          {{ routeDraft.id }}
        </div>
        <div 
            class="color-badge" 
            :style="{ backgroundColor: routeDraft.colorCode || '#003087' }"
            :title="routeDraft.colorCode"
        ></div>
      </div>
    </div>
  </button>
</template>

<style scoped>
.route-draft-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: #ffffff;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  text-align: left;
}

.route-draft-card:hover {
  box-shadow: 0 4px 12px rgba(4, 56, 115, 0.1);
  transform: translateY(-2px);
}

.route-draft-card:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(4, 56, 115, 0.15);
}

.route-draft-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.color-badge {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  flex-shrink: 0;
}

button {
  all: unset;
  box-sizing: border-box;
}

.route-draft-card:focus {
  outline: 2px solid #043873;
  outline-offset: 2px;
}
</style>

