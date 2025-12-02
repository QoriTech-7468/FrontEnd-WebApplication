import useIamStore from "../application/iam.store.js";

export const iamInterceptor = (config) => {
    const store = useIamStore();
    
    // Public endpoints that do NOT require token (only the path, without baseURL)
    const signInPath = import.meta.env.VITE_RUTANA_SIGN_IN_ENDPOINT_PATH || '';
    const signUpPath = import.meta.env.VITE_RUTANA_SIGN_UP_ENDPOINT_PATH || '';
    
    // Get the complete request URL
    const requestUrl = config.url || '';
    
    // Check if the URL contains any of the public endpoints
    const isPublicEndpoint = signInPath && requestUrl.includes(signInPath) ||
                            signUpPath && requestUrl.includes(signUpPath);
    
    console.log('🔍 Interceptor - URL:', requestUrl);
    console.log('🔍 Interceptor - isPublicEndpoint:', isPublicEndpoint);
    console.log('🔍 Interceptor - isSignedIn:', store.isSignedIn);
    
    // For public endpoints, ensure there is NO Authorization header
    if (isPublicEndpoint) {
        console.log('🚫 Public endpoint - Token not added');
        // Ensure to remove any token that might be present
        delete config.headers.Authorization;
    } else {
        // For protected endpoints, add token if it exists
        // Check both in store and localStorage (for initialization)
        const token = store.currentUserToken || localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ Token added to request');
        }
    }
    
    return config;
}