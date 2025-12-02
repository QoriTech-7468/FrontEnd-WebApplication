import useIamStore from "../application/iam.store.js";

// Flag to prevent multiple simultaneous initializations
let isInitializing = false;

export const authenticationGuard = (to, from, next) => {
    const store = useIamStore();
    
    // Public routes that do not require authentication
    const publicRoutes = ['iam-sign-in-up'];
    
    // Routes that require authentication but not organization
    const routesWithoutOrg = ['invitations'];
    
    // Check token in localStorage
    const token = localStorage.getItem('token');
    
    // If there's a token but the store is not initialized, initialize user
    // This validates the token and updates user data from the backend
    if (token && !store.isSignedIn && !isInitializing) {
        isInitializing = true;
        // Initialize user in background (does not block navigation)
        store.initializeUser()
            .finally(() => {
                isInitializing = false;
            });
        // Meanwhile, use cached data to allow immediate navigation
        store.isSignedIn = true;
    }
    
    const isAuthenticated = store.isSignedIn || !!token;
    const isPublicRoute = publicRoutes.includes(to.name);
    const isRouteWithoutOrg = routesWithoutOrg.includes(to.name);
    
    // Get organizationId and role from store or localStorage
    const organizationId = store.currentUserOrganizationId || 
                          (() => {
                              try {
                                  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                                  return userData.organizationId || null;
                              } catch {
                                  return null;
                              }
                          })();
    
    const userRole = store.currentUserRole?.toLowerCase() || 
                    (() => {
                        try {
                            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                            return userData.role?.toLowerCase() || null;
                        } catch {
                            return null;
                        }
                    })();
    
    // Helper function to get default route based on role
    const getDefaultRoute = () => {
        if (!organizationId) {
            return 'invitations';
        }
        if (userRole === 'dispatcher') {
            return 'transportist-routes';
        }
        // Admin and Owner go to management
        return 'management';
    };
    
    // If authenticated but has no organizationId, must go to invitations
    if (isAuthenticated && !organizationId && !isRouteWithoutOrg && !isPublicRoute) {
        // If already on invitations, allow navigation
        if (to.name === 'invitations') {
            next();
            return;
        }
        // If trying to go to another protected route without organizationId, redirect to invitations
        next({ name: 'invitations' });
        return;
    }
    
    // If has organizationId and tries to go to invitations, redirect according to role
    if (isAuthenticated && organizationId && to.name === 'invitations') {
        next({ name: getDefaultRoute() });
        return;
    }
    
    // If trying to go to /auth/login but is authenticated, redirect according to role
    if (to.path === '/auth/login' && isAuthenticated) {
        next({ name: getDefaultRoute() });
        return;
    }
    
    // If on root route, redirect according to authentication and role
    if (to.path === '/' || to.name === undefined) {
        if (isAuthenticated) {
            next({ name: getDefaultRoute() });
            return;
        } else {
            next({ name: 'iam-sign-in-up' });
            return;
        }
    }
    
    // If authenticated and tries to go to a public route (login), redirect according to role
    if (isAuthenticated && isPublicRoute) {
        next({ name: getDefaultRoute() });
        return;
    }
    
    // If not authenticated and tries to access a protected route, redirect to login
    if (!isAuthenticated && !isPublicRoute && !isRouteWithoutOrg) {
        next({ name: 'iam-sign-in-up' });
        return;
    }
    
    // Allow navigation
    next();
}