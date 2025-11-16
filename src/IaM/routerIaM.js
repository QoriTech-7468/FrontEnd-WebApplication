import { createRouter, createWebHistory } from 'vue-router'
import LoginRegister from '../IaM/presentation/views/LoginRegister.vue'
import Invitations from '../FleetAndResourceManagement/presentation/views/Invitations.vue'
import Layout from '../shared/presentation/components/layout.vue'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginRegister },
    { path: '/invitations', component: Invitations },
    {
        path: '/layout',
        component: Layout,
        meta: { requiresAuth: true }
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})

// Guardia de autenticación
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('rutana_token')
    if (to.meta.requiresAuth && !token) {
        next('/login')
    } else {
        next()
    }
})