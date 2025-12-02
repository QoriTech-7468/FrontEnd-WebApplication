// Lazy-loaded components
const Vehicle = () => import('./views/vehicles.vue');

const Users = () => import('./views/member-organization.vue');

const managementRoutes = [
    { path: 'vehicles',           name: 'vehicles-list',      component: Vehicle, meta: {title: 'Vehicles'} },

    {path: 'Users', name:  'users-list',     component: Users, meta: {title: 'Users'} },
];

export default managementRoutes;

