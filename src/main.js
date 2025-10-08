import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import {
    Toolbar,
    Button, Toast, ConfirmDialog
} from "primevue";
import {definePreset} from "@primeuix/themes";
import router from "./router.js";

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{sky.50}',
            100: '{sky.100}',
            200: '{sky.200}',
            300: '{sky.300}',
            400: '{sky.400}',
            500: '{sky.500}',
            600: '{sky.600}',
            700: '{sky.700}',
            800: '{sky.800}',
            900: '{indigo.900}',
            950: '{indigo.950}'
        }
    }
});
createApp(App)
    .use(PrimeVue, {theme:{preset:MyPreset}}
    )
    .use(router)
    .component('pv-toolbar', Toolbar)
    .component('pv-button',Button)


    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-toast', Toast)
    .mount('#app')
