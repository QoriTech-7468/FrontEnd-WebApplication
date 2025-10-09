import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import i18n from './i18n.js';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import {
    Toolbar,
    Button, Toast, ConfirmDialog, ConfirmationService, ToastService
} from "primevue";
import {definePreset} from "@primeuix/themes";
import router from "./router.js";

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#e6f0ff',
            100: '#b3d1ff',
            200: '#80b2ff',
            300: '#4d93ff',
            400: '#1a74ff',
            500: '#043873',
            600: '#043873',
            700: '#043873',
            800: '#043873',
            900: '#043873',
            950: '#043873'
        }
    }
});
createApp(App)
    .use(PrimeVue, {theme:{preset:MyPreset, options: {darkModeSelector: 'never'}}}
    )
    .use(router)
    .use(i18n)
    .component('pv-toolbar', Toolbar)
    .component('pv-button',Button)


    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-toast', Toast)
    .use(ToastService)
    .use(ConfirmationService)
    .component('pv-toolbar', Toolbar)
    .component('pv-button', Button)
    .component('pv-toast', Toast)
    .component('pv-confirm-dialog', ConfirmDialog)
    .mount('#app')
