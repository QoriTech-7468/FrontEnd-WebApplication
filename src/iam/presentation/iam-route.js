// Lazy-loaded components
const LoginRegister = () => import('./views/login-register.vue');
const Invitations = () => import('./views/invitations.vue');

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
    { 
        path: 'invitations', 
        name: 'invitations', 
        component: Invitations,
        meta: { title: 'Invitations' }
    },
    // Fallback route
    { 
        path: ':pathMatch(.*)*', 
        redirect: '/auth/login' 
    }
];

export default iamRoutes;

