import {createRouter, createWebHistory} from "vue-router";
import managementRoutes from "./FleetAndResourceManagement/presentation/management-route.js";


const routes = [
    { path: '/management',      name: 'management', children: managementRoutes },
    //{ path: '/',                redirect: '/management',   children: ['clients'] },
   // { path: '/:pathMatch(.*)*', name: 'not-found',  component: pageNotFound,    meta: { title: 'Page Not Found' } },
];

const router = createRouter({
    history:    createWebHistory(import.meta.env.BASE_URL),
    routes:     routes,
});

router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    let baseTitle = 'Rutana';
    document.title = to.meta['title'] ? `${to.meta['title']} - ${baseTitle}` : baseTitle;
    next();
});

export default router;