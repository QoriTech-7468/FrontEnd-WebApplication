<template>
  <pv-panel :header="$t('clients.searchHeader')" class="shadow-1">
    <pv-icon-field iconPosition="left" class="mb-3">
      <pv-input-icon>
        <i class="pi pi-search" />
      </pv-input-icon>
      <pv-input-text v-model="modelQuery" :placeholder="$t('clients.searchPlaceholder')" />
    </pv-icon-field>

    <div class="text-700 mb-2">{{ $t('clients.title') }} ({{ filtered.length }})</div>

    <pv-scroll-panel style="height: 52vh">
      <ul class="list-none p-0 m-0">
        <li
            v-for="c in filtered"
            :key="c.id"
            class="flex align-items-center justify-content-between p-2 border-round cursor-pointer hover:surface-100 mb-1"
            :class="{ 'border-left-3 border-yellow-500': c.id === modelSelectedId }"
            @click="modelSelectedId = c.id"
        >
          <span class="text-900 font-medium">{{ c.name }}</span>
          <pv-tag :value= c.status :severity="statusSeverity(c.status)" />
        </li>
      </ul>
    </pv-scroll-panel>
  </pv-panel>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  clients: { type: Array, default: () => [] },
  selectedId: Number,
  query: String
});
const emit = defineEmits(["update:selectedId", "update:query"]);

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
  if (!t) return props.clients;
  return props.clients.filter(c => (c?.name || "").toLowerCase().includes(t));
});

function severity(s) {
  const v = (s || "").toLowerCase();
  if (v === "enabled" || v === "active") return "success";
  if (v === "disabled" || v === "disable") return "danger";
  return "info";
}

const statusSeverity = severity;
</script>

<style scoped>
.shadow-1{ box-shadow:0 2px 8px rgba(0,0,0,.06); }
</style>
