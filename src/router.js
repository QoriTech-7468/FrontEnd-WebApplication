import {createRouter, createWebHistory} from "vue-router";
import managementRoutes from "./fleets/presentation/management-vehicle-route.js";
import routePlanningRoutes from "./planning/presentation/routing-route.js";
import ClientRoutes from "./crm/presentation/management-client-route.js";
import iamRoutes from "./iam/presentation/iam-route.js";
import Layout from "./shared/presentation/components/layout.vue";
import { authenticationGuard } from "./iam/presentation/infrastructure/authentication.guard.js";

const routes = [
    { 
        path: '/management',      
        name: 'management',
        component: Layout,
        children: [
            ...managementRoutes, 
            { path: 'clients', name: 'clients', children: ClientRoutes},
        { path: 'routes', name: 'management-routes', children: routePlanningRoutes }
        ]
    },
    { 
        path: '/auth', name: 'auth', children: iamRoutes 
    },
    {
        path: '/',
        redirect: '/auth/login'
    },
    //{ path: '/',                redirect: '/management',   children: ['clients'] },
   // { path: '/:pathMatch(.*)*', name: 'not-found',  component: pageNotFound,    meta: { title: 'Page Not Found' } },
];

const router = createRouter({
    history:    createWebHistory(import.meta.env.BASE_URL),
    routes:     routes,
});

router.beforeEach((to, from, next) => {
    const fromName = from.name || 'initial';
    const toName = to.name || to.path;
    console.log(`Navigating from ${fromName} to ${toName}`);
    let baseTitle = 'Rutana';
    document.title = to.meta['title'] ? `${to.meta['title']} - ${baseTitle}` : baseTitle;
    authenticationGuard(to, from, next);
});

export default router;
