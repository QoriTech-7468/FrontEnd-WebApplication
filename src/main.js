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
    Button,
    Toast,
    ConfirmDialog,
    ConfirmationService,
    ToastService,
    Dialog,
    Panel,
    Tag,
    IconField,
    InputIcon,
    ScrollPanel,
    DatePicker,
    Tabs,
    TabPanel,
    AutoComplete,
    Dropdown,
    RadioButton,
    Textarea,
    ProgressSpinner,
    Select,
    Badge,
    ProgressBar
} from "primevue";
import InputText from "primevue/inputtext";
import {definePreset} from "@primeuix/themes";
import router from "./router.js";
import pinia from "./pinia.js";
import InputNumber from "primevue/inputnumber";
import useIamStore from "./iam/presentation/application/iam.store.js";

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
const app = createApp(App)
    .use(PrimeVue, {theme:{preset:MyPreset, options: {darkModeSelector: 'never'}}}
    )
    .use(router)
    .use(i18n)
    .component('pv-dropdown',Dropdown)
    .component('pv-toolbar', Toolbar)
    .component('pv-button',Button)
    .component('pv-panel', Panel)
    .component('pv-tag', Tag)
    .component('pv-input-text', InputText)
    .component('pv-input-number', InputNumber)
    .component('pv-icon-field', IconField)
    .component('pv-input-icon', InputIcon)
    .component('pv-scroll-panel', ScrollPanel)
    .component('pv-date-picker', DatePicker)
    .component('pv-tabs', Tabs)
    .component('pv-tab-panel', TabPanel)
    .component('pv-auto-complete', AutoComplete)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-toast', Toast)
    .component('pv-radio-button', RadioButton)
    .component('pv-textarea', Textarea)
    .component('pv-progress-spinner', ProgressSpinner)
    .component('pv-select', Select)
    .component('pv-badge', Badge)
    .component('pv-progress-bar', ProgressBar)
    .component('pv-dialog', Dialog)
    .use(ToastService)
    .use(ConfirmationService)
    .use(pinia);

app.mount('#app');

// Inicializar usuario si hay token al cargar la app
// Se hace después de montar para asegurar que Pinia esté disponible
const iamStore = useIamStore();
const token = localStorage.getItem('token');
if (token) {
    // Inicializar usuario en background (valida token y actualiza datos)
    iamStore.initializeUser().catch(error => {
        console.error('Error al inicializar usuario al cargar la app:', error);
    });
}
