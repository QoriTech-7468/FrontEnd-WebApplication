import { createRouter, createWebHistory } from 'vue-router';

// views / components
import LoginRegister from '@/IaM/presentation/views/LoginRegister.vue';
import Invitations from '@/FleetAndResourceManagement/presentation/views/Invitations.vue';
import Layout from '@/shared/presentation/components/layout.vue';

// rutas del módulo management (lazy)
import managementRoutes from '@/FleetAndResourceManagement/presentation/management-route.js';

const routes = [
    { path: '/', redirect: '/login' },

    { path: '/login', name: 'login', component: LoginRegister },

    { path: '/invitations', name: 'invitations', component: Invitations },

    {
        path: '/layout',
        name: 'layout',
        component: Layout,
        children: [
            // aquí insertamos las rutas de management-route, que son relativas
            ...managementRoutes
        ]
    },

    // fallback
    { path: '/:pathMatch(.*)*', redirect: '/login' }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;