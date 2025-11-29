import useIamStore from "../application/iam.store.js";

// Flag para evitar múltiples inicializaciones simultáneas
let isInitializing = false;

export const authenticationGuard = (to, from, next) => {
    const store = useIamStore();
    
    // Rutas públicas que no requieren autenticación
    const publicRoutes = ['iam-sign-in-up'];
    
    // Rutas que requieren autenticación pero no organización
    const routesWithoutOrg = ['invitations'];
    
    // Verificar token en localStorage
    const token = localStorage.getItem('token');
    
    // Si hay token pero el store no está inicializado, inicializar usuario
    // Esto valida el token y actualiza los datos del usuario desde el backend
    if (token && !store.isSignedIn && !isInitializing) {
        isInitializing = true;
        // Inicializar usuario en background (no bloquea la navegación)
        store.initializeUser()
            .finally(() => {
                isInitializing = false;
            });
        // Mientras tanto, usar datos del cache para permitir navegación inmediata
        store.isSignedIn = true;
    }
    
    const isAuthenticated = store.isSignedIn || !!token;
    const isPublicRoute = publicRoutes.includes(to.name);
    const isRouteWithoutOrg = routesWithoutOrg.includes(to.name);
    
    // Obtener organizationId del store o del localStorage
    const organizationId = store.currentUserOrganizationId || 
                          (() => {
                              try {
                                  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                                  return userData.organizationId || null;
                              } catch {
                                  return null;
                              }
                          })();
    
    // Si está autenticado pero no tiene organizationId, debe ir a invitations
    if (isAuthenticated && !organizationId && !isRouteWithoutOrg && !isPublicRoute) {
        // Si ya está en invitations, permitir navegación
        if (to.name === 'invitations') {
            next();
            return;
        }
        // Si intenta ir a otra ruta protegida sin organizationId, redirigir a invitations
        next({ name: 'invitations' });
        return;
    }
    
    // Si tiene organizationId e intenta ir a invitations, redirigir a management
    if (isAuthenticated && organizationId && to.name === 'invitations') {
        next({ name: 'management' });
        return;
    }
    
    // Si está intentando ir a /auth/login pero está autenticado, redirigir según organizationId
    if (to.path === '/auth/login' && isAuthenticated) {
        if (!organizationId) {
            next({ name: 'invitations' });
        } else {
            next({ name: 'management' });
        }
        return;
    }
    
    // Si está en la ruta raíz, redirigir según autenticación y organizationId
    if (to.path === '/' || to.name === undefined) {
        if (isAuthenticated) {
            if (!organizationId) {
                next({ name: 'invitations' });
            } else {
                next({ name: 'management' });
            }
            return;
        } else {
            next({ name: 'iam-sign-in-up' });
            return;
        }
    }
    
    // Si está autenticado e intenta ir a una ruta pública (login), redirigir según organizationId
    if (isAuthenticated && isPublicRoute) {
        if (!organizationId) {
            next({ name: 'invitations' });
        } else {
            next({ name: 'management' });
        }
        return;
    }
    
    // Si no está autenticado e intenta acceder a una ruta protegida, redirigir a login
    if (!isAuthenticated && !isPublicRoute && !isRouteWithoutOrg) {
        next({ name: 'iam-sign-in-up' });
        return;
    }
    
    // Permitir navegación
    next();
}