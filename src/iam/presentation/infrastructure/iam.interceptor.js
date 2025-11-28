import useIamStore from "../application/iam.store.js";

export const iamInterceptor = (config) => {
    const store = useIamStore();
    
    // Endpoints públicos que NO requieren token (solo el path, sin el baseURL)
    const signInPath = import.meta.env.VITE_RUTANA_SIGN_IN_ENDPOINT_PATH || '';
    const signUpPath = import.meta.env.VITE_RUTANA_SIGN_UP_ENDPOINT_PATH || '';
    
    // Obtener la URL completa de la petición
    const requestUrl = config.url || '';
    
    // Verificar si la URL contiene alguno de los endpoints públicos
    const isPublicEndpoint = signInPath && requestUrl.includes(signInPath) ||
                            signUpPath && requestUrl.includes(signUpPath);
    
    console.log('🔍 Interceptor - URL:', requestUrl);
    console.log('🔍 Interceptor - isPublicEndpoint:', isPublicEndpoint);
    console.log('🔍 Interceptor - isSignedIn:', store.isSignedIn);
    
    // Para endpoints públicos, asegurarse de que NO haya header Authorization
    if (isPublicEndpoint) {
        console.log('🚫 Endpoint público - No se agrega token');
        // Asegurarse de eliminar cualquier token que pueda estar presente
        delete config.headers.Authorization;
    } else if (store.isSignedIn) {
        // Solo agregar token si está autenticado Y NO es un endpoint público
        const token = store.currentUserToken || localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ Token agregado a la petición');
        }
    }
    
    return config;
}