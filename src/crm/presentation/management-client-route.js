const ClientView = () => import('./views/clients.vue');


const ClientRoutes = [
    {
        path: '',
        name: 'client-list',
        component: ClientView,
        meta: { title: 'Clients' },
    },
];

export default ClientRoutes;
