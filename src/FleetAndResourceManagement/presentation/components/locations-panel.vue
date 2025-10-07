<template>
  <Panel header="Locations: {{ selected?.locations.length ?? 0 }}" class="shadow-1">
    <div v-if="!selected" class="text-600">Select a client</div>

    <template v-else>
      <div class="border-left-3 border-yellow-500 pl-3 mb-3">
        <div class="text-900 font-medium mb-1">{{ selected.name }}</div>
        <Tag :value="selected.status" :severity="statusSeverity(selected.status)" />
      </div>

      <ScrollPanel style="height: 40vh">
        <div
            v-for="loc in selected.locations"
            :key="loc.id"
            class="border-1 surface-border border-round p-3 mb-2"
        >
          <div class="text-900 font-medium">{{ loc.title }}</div>
          <div class="text-600">{{ loc.type }}</div>
          <div class="mt-2">
            <Tag :value="loc.status" :severity="statusSeverity(loc.status)" />
          </div>
        </div>
      </ScrollPanel>
    </template>
  </Panel>
</template>

<script setup>
import Panel from "primevue/panel";
import Tag from "primevue/tag";
import ScrollPanel from "primevue/scrollpanel";

defineProps({
  selected: { type: Object, default: null }
});
defineEmits(["new-location"]);

function statusSeverity(s) {
  return s?.toLowerCase() === "active" ? "success"
      : s?.toLowerCase() === "disable" ? "danger"
          : "info";
}
</script>

<style scoped>
.shadow-1{ box-shadow:0 2px 8px rgba(0,0,0,.06); }
</style>
