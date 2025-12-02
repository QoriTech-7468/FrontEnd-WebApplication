<script setup>
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import useStore from "../../application/fleets.store.js";
import {computed, onMounted, ref} from "vue";
import {User} from "../../domain/model/user.entity.js";
import {Vehicle} from "../../domain/model/vehicle.entity.js";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const store = useStore();
const {errors, getUsersById, vehicles, fetchVehicles } = store;

this.id = id;
this.fullname = fullname;
this.email = email;
this.role = role;
this.password = password;
this.vehicleId = vehicleId;
this.vehicle = vehicle instanceof Vehicle ? vehicle: null;

const form = ref({fullname: '', email: '',role:'', vehicleId: null});
const isEdit = computed(() => !!route.params.id);

onMounted(() => {
  if (!vehicles.length) fetchVehicles();
  if (isEdit.value) {
    const user = getUsersById(route.params.id);
    if (user) {
      form.value.fullname = user.fullname;
      form.value.email = user.email;
      form.value.vehicleId = user.role;
    } else router.push({name: 'rutana-user'});
  }
});

function getUsersbyId(id) {
  return store.getUsersById(id);
}

const saveTutorial = () => {
  const tutorial = new Tutorial({
    id: isEdit.value ? route.params.id : null,
    title: form.value.title,
    summary: form.value.summary,
    categoryId: form.value.categoryId,
  });
  if (isEdit.value) updateTutorial(tutorial); else addTutorial(tutorial);
  navigateBack();
};

const navigateBack = () => {
  router.push({name: 'publishing-tutorials'});
};
</script>

<template>

</template>

<style scoped>

</style>