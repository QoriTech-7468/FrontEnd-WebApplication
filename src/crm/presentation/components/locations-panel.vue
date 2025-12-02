<template>
  <pv-panel :header="`Locations: ${locationsCountText}`" class="shadow-1">
    <!-- Nada seleccionado -->
    <div v-if="!selected" class="text-600">{{ $t('clients.selectPrompt') }}</div>

    <!-- Con cliente -->
    <template v-else>
      <div class="border-left-3 border-yellow-500 pl-3 mb-3">
        <div class="text-900 font-medium mb-1">{{ selected.name }}</div>
        <pv-tag :value="selected.status" :severity="statusSeverity(selected.status)" />
      </div>

      <pv-scroll-panel style="height: 40vh">
        <!-- Lista vacía -->
        <div v-if="safeLocations.length === 0" class="text-600">No locations</div>

        <!-- Items -->
        <div
            v-for="loc in safeLocations"
            :key="loc.id ?? `${loc.title}-${loc.type}`"
            class="border-1 surface-border border-round p-3 mb-2"
        >
          <div class="flex align-items-center justify-content-between mb-2">
            <div class="flex-1">
              <div class="text-900 font-medium">{{ loc.address }}</div>
              <div class="text-600">{{ loc.proximity }}</div>
            </div>
            <pv-button
                icon="pi pi-pencil"
                class="p-button-text p-button-sm"
                @click="$emit('edit-location', loc)"
                v-tooltip.top="'Edit location'"
            />
          </div>
          <div class="mt-2">
            <pv-tag :value="loc.status" :severity="statusSeverity(loc.status)" />
          </div>
        </div>
      </pv-scroll-panel>
    </template>
  </pv-panel>
</template>

<script setup>
import { computed } from 'vue';
import { Button as PvButton } from 'primevue';

const props = defineProps({
  // El padre pasa el cliente seleccionado (puede ser null)
  selected: { type: Object, default: null }
});

const emit = defineEmits(['edit-location']);

/** Locations seguras (si no existen, devolvemos []) */
const safeLocations = computed(() => {
  const arr = props.selected?.locations;
  return Array.isArray(arr) ? arr : [];
});

/** Texto del header */
const locationsCountText = computed(() => String(safeLocations.value.length));

/** Severidad para Tag */
function severity(s) {
  const v = (s || '').toLowerCase();
  if (v === 'enabled' || v === 'active') return 'success';
  if (v === 'disable' || v === 'disable') return 'danger';
  return 'info';
}

// Alias para coincidir con el template
const statusSeverity = severity;
</script>

<style scoped>
.shadow-1 { box-shadow: 0 2px 8px rgba(0,0,0,.06); }
</style>

