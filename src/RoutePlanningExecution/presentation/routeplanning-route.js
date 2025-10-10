// Lazy-loaded components
const RoutesView = () => import('./views/routes-view.vue');
const RouteEdit = () => import('./views/route-edit.vue');
const RouteMonitor = () => import('./views/route-monitor-view.vue');

const routePlanningRoutes = [
    {
        path: 'list',
        name: 'routes-list',
        component: RoutesView,
        meta: { title: 'Routes' }
    },
    {
        path: ':routeId/edit',
        name: 'route-edit',
        component: RouteEdit,
        meta: { title: 'Edit Route' }
    },
    {
        path: ':routeId/monitor',
        name: 'route-monitor',
        component: RouteMonitor,
        meta: { title: 'Monitor Route' }
    }
];

export default routePlanningRoutes;
