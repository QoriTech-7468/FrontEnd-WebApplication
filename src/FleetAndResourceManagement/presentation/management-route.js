// Lazy-loaded components
const Vehicle = () => import('./views/vehicles.vue');
const Clients = () => import('./views/clients.vue');
const Users = () => import('./views/Users.vue');


const managementRoutes = [

    { path: 'vehicles',           name: 'vehicles-list',      component: Vehicle, meta: {title: 'Vehicles'} },
    {path:  'clients',     name: 'clients-list',     component: Clients, meta: {title: 'Clients'} },
    {path: 'Users', name:  'users-list',     component: Users, meta: {title: 'Users'} },
];

export default managementRoutes;