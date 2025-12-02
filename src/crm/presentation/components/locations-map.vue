<template>
  <div class="locations-list">
    <div
        v-if="locations && locations.length > 0"
        class="flex flex-column gap-2"
    >
      <div
          v-for="location in locations"
          :key="location.id"
          class="location-item p-3 border-round surface-border border-1 cursor-pointer hover:surface-hover transition-colors transition-duration-150"
          @click="$emit('marker-click', location)"
      >
        <div class="flex align-items-center gap-2">
          <i class="pi pi-map-marker text-primary" />
          <div class="flex-1">
            <div class="font-semibold text-900">{{ location.address }}</div>
            <div class="text-600 text-sm">
              <span v-if="location.proximity" class="mr-2">
                <pv-tag :value="location.proximity" severity="info" />
              </span>
              <span v-if="location.latitude && location.longitude" class="text-500">
                {{ location.latitude }}, {{ location.longitude }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
        v-else
        class="flex align-items-center justify-content-center"
        style="height: 300px;"
    >
      <div class="text-center text-600">
        <i class="pi pi-map-marker text-4xl mb-3" />
        <p>No locations available</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  locations: Array
});

const emit = defineEmits(["marker-click"]);
</script>

<style scoped>
.locations-list {
  width: 100%;
  min-height: 300px;
}

.location-item {
  transition: all 0.2s;
}

.location-item:hover {
  transform: translateX(4px);
}
</style>