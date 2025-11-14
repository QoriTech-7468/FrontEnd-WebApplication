<template>
  <div class="map-picker">
    <div class="field mb-2">
      <label class="block text-700 mb-1">Search Address</label>
      <input
          id="autocomplete"
          v-model="localAddress"
          type="text"
          placeholder="Type address..."
          class="p-inputtext p-component w-full"
      />
    </div>

    <div id="map" style="height: 250px; border-radius: 10px;"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, defineEmits, defineProps } from "vue";

const props = defineProps({
  address: String,
  latitude: Number,
  longitude: Number,
});
const emit = defineEmits(["update:address", "update:latitude", "update:longitude"]);

const localAddress = ref(props.address || "");
let map, marker, geocoder, autocomplete;

async function loadGoogleMaps() {
  // Carga el script base del API
  await new Promise((resolve, reject) => {
    if (window.google && window.google.maps) return resolve();
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

onMounted(async () => {
  await loadGoogleMaps();

  const center = {
    lat: props.latitude ?? -12.0464,
    lng: props.longitude ?? -77.0428,
  };

  // Inicializar mapa y componentes
  map = new google.maps.Map(document.getElementById("map"), {
    center,
    zoom: 6,
  });

  marker = new google.maps.Marker({
    map,
    position: center,
    draggable: true,
  });

  geocoder = new google.maps.Geocoder();

  const input = document.getElementById("autocomplete");
  autocomplete = new google.maps.places.Autocomplete(input, {
    fields: ["formatted_address", "geometry"],
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) return;
    const loc = place.geometry.location;
    map.setCenter(loc);
    map.setZoom(15);
    marker.setPosition(loc);
    updateValues(place.formatted_address, loc.lat(), loc.lng());
  });

  map.addListener("click", async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    marker.setPosition(event.latLng);

    const results = await geocoder.geocode({ location: { lat, lng } });
    const formatted = results.results[0]?.formatted_address || "";
    updateValues(formatted, lat, lng);
  });
});

function updateValues(address, lat, lng) {
  localAddress.value = address;
  emit("update:address", address);
  emit("update:latitude", lat);
  emit("update:longitude", lng);
}
</script>


<style scoped>
.map-picker {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
