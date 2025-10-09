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
    Button, Toast, ConfirmDialog, ConfirmationService, ToastService,
    Panel,
    Tag,
    InputText,
    IconField,
    InputIcon,
    ScrollPanel,
    DatePicker
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
        },
        accent: {
            50: '#fffdf0',
            100: '#fff9d6',
            200: '#fff2b3',
            300: '#ffeb90',
            400: '#ffe46d',
            500: '#FFD60A',
            600: '#FFD60A',
            700: '#FFD60A',
            800: '#FFD60A',
            900: '#FFD60A',
            950: '#FFD60A'
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
    .component('pv-panel', Panel)
    .component('pv-tag', Tag)
    .component('pv-input-text', InputText)
    .component('pv-icon-field', IconField)
    .component('pv-input-icon', InputIcon)
    .component('pv-scroll-panel', ScrollPanel)
    .component('pv-date-picker', DatePicker)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-toast', Toast)
    .use(ToastService)
    .use(ConfirmationService)
    .mount('#app')
