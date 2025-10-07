import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import App from "./App.vue";

createApp(App)
    .use(PrimeVue, { theme: { preset: Aura } })
    .mount("#app");