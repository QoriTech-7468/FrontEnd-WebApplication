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
          <div class="text-900 font-medium">{{ loc.address }}</div>
          <div class="text-600">{{ loc.type }}</div>
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

const props = defineProps({
  // El padre pasa el cliente seleccionado (puede ser null)
  selected: { type: Object, default: null }
});

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
  if (v === 'disabled' || v === 'disable') return 'danger';
  return 'info';
}
// Alias para coincidir con el template
const statusSeverity = severity;
</script>

<style scoped>
.shadow-1 { box-shadow: 0 2px 8px rgba(0,0,0,.06); }
</style>
