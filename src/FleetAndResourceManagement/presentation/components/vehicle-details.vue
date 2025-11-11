<template>
  <div class="grid">
    <div class="col-12">
      <div class="flex align-items-center justify-content-between mb-3">
        <div class="flex gap-4">
          <div>
            <span class="text-700">{{ $t('vehicles.details.plateLabel') }}</span>
            <b>{{ vehicle.plate }}</b>
          </div>
          <div>
            <span class="text-700">{{ $t('vehicles.details.capacityLabel') }}</span>
            <b>{{ vehicle.capacity }} kg</b>
          </div>
        </div>

        <div class="flex align-items-center gap-2">
          <span class="text-700">{{ $t('vehicles.details.stateLabel') }}</span>

          <!-- 👇 Usa directamente isActive -->
          <pv-tag
              v-if="vehicle.isActive"
              :value="$t(`vehicles.status.${vehicle.isActive.toLowerCase()}`)"
              :severity="severity(vehicle.isActive)"
          />

          <Button
              :label="$t('vehicles.details.edit')"
              size="small"
              outlined
          />
        </div>
      </div>

      <Divider />

      <div>
        <div class="text-xl font-semibold mb-2">
          {{ $t('vehicles.details.membersTitle') }}
        </div>
        <Button
            :label="$t('vehicles.details.addMembers')"
            size="small"
            outlined
            class="mb-3"
        />
        <ul class="list-none p-0 m-0">
          <li
              v-for="m in (vehicle.members || [])"
              :key="m.id"
              class="flex align-items-center gap-2 mb-2"
          >
            <i class="pi pi-user"></i>
            <span>{{ m.name }}</span>
          </li>

          <li v-if="!vehicle.members || vehicle.members.length === 0" class="text-600">
            No members
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import Divider from "primevue/divider";

defineProps({
  vehicle: { type: Object, required: true }
});
const vehicle = props.vehicle
function severity(value) {
  return value?.toLowerCase() === "enabled" ? "success" : "danger";
}

</script>

<style scoped>
</style>
