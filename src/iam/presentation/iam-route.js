// Lazy-loaded components
const LoginRegister = () => import('./views/LoginRegister.vue');
const Invitations = () => import('../../fleets/presentation/views/invitations.vue');

const iamRoutes = [
    { 
        path: '', 
        redirect: '/auth/login' 
    },
    { 
        path: 'login', 
        name: 'iam-sign-in-up', 
        component: LoginRegister,
        meta: { title: 'Login' }
    },
    // { 
    //     path: 'invitations', 
    //     name: 'invitations', 
    //     component: Invitations,
    //     meta: { title: 'Invitations' }
    // },
    // fallback
    { 
        path: ':pathMatch(.*)*', 
        redirect: '/auth/login' 
    }
];

export default iamRoutes;

