import useIamStore from "../application/iam.store.js";

export const authenticationGuard = (to, from, next) => {
    const store = useIamStore();
    
    // Rutas públicas que no requieren autenticación
    const publicRoutes = ['iam-sign-in-up'];
    
    // Verificar token en localStorage como respaldo si el store no está inicializado
    // Esto es importante para cuando se refresca la página
    const token = localStorage.getItem('token');
    if (token && !store.isSignedIn) {
        // Si hay token pero el store no está inicializado, establecer como autenticado
        // Nota: En producción, deberías validar el token con el backend
        store.isSignedIn = true;
    }
    
    const isAuthenticated = store.isSignedIn || !!token;
    const isPublicRoute = publicRoutes.includes(to.name);
    
    // Si está intentando ir a /auth/login pero está autenticado, redirigir a management
    if (to.path === '/auth/login' && isAuthenticated) {
        next({ name: 'management' });
        return;
    }
    
    // Si está en la ruta raíz, redirigir según autenticación
    if (to.path === '/' || to.name === undefined) {
        if (isAuthenticated) {
            next({ name: 'management' });
            return;
        } else {
            next({ name: 'iam-sign-in-up' });
            return;
        }
    }
    
    // Si está autenticado e intenta ir a una ruta pública (login), redirigir a management
    if (isAuthenticated && isPublicRoute) {
        next({ name: 'management' });
        return;
    }
    
    // Si no está autenticado e intenta acceder a una ruta protegida, redirigir a login
    if (!isAuthenticated && !isPublicRoute) {
        next({ name: 'iam-sign-in-up' });
        return;
    }
    
    // Permitir navegación
    next();
}