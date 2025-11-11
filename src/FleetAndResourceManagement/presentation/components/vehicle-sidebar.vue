<template>
  <Panel :header="$t('vehicles.searchHeader')" class="shadow-1">
    <div class="p-inputgroup mb-3">
      <span class="p-inputgroup-addon"><i class="pi pi-search"></i></span>
      <InputText v-model="modelQuery" :placeholder="$t('vehicles.searchPlaceholder')" />
    </div>

    <div class="text-700 mb-2">{{ $t('vehicles.vehiclesList', { count: filtered.length }) }}</div>

    <ScrollPanel style="height: 52vh">
      <ul class="list-none p-0 m-0">
        <li
            v-for="v in filtered"
            :key="v.id"
            class="flex align-items-start justify-content-between p-2 border-round cursor-pointer hover:surface-100 mb-1"
            :class="[{ 'border-left-3 border-blue-500': v.id === modelSelectedId }]"
            @click="modelSelectedId = v.id"
        >
          <div class="flex flex-column">
            <span class="text-900 font-medium">{{ v.plate }}</span>
            <small class="text-600">{{ $t('vehicles.details.capacityLabel') }} {{ v.capacity }} kg</small>
          </div>
          <Tag :value="$t(`vehicles.status.${v.isActive.toLowerCase()}`)" :severity="severity(v.isActive)" />
        </li>
      </ul>
    </ScrollPanel>
  </Panel>
</template>

<script setup>
import { computed } from "vue";
import Panel from "primevue/panel";
import InputText from "primevue/inputtext";
import ScrollPanel from "primevue/scrollpanel";
import Tag from "primevue/tag";

const props = defineProps({
  vehicles: { type: Array, required: true },
  selectedId: Number,
  query: String
});
const emit = defineEmits(["update:selectedId","update:query"]);

const modelSelectedId = computed({
  get: () => props.selectedId ?? null,
  set: v => emit("update:selectedId", v)
});
const modelQuery = computed({
  get: () => props.query ?? "",
  set: v => emit("update:query", v)
});

const filtered = computed(() => {
  const t = (props.query || "").trim().toLowerCase();
  if (!t) return props.vehicles;
  return props.vehicles.filter(v => v.plate.toLowerCase().includes(t));
});

function severity(s) {
  return s?.toLowerCase() === "enabled" ? "success" : "danger";
}
</script>

<style scoped>
.shadow-1{ box-shadow:0 2px 8px rgba(0,0,0,.06); }
</style>
