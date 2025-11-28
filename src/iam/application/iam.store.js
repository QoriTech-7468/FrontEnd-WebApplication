import { IamApi } from "../infrastructure/iam-api.js";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { SignInAssembler } from "../infrastructure/sign-in.assembler.js";
import { SignUpAssembler } from "../infrastructure/sign-up.assembler.js";
import { User } from "../domain/user.entity.js";

const iamApi = new IamApi();

// Funciones helper para persistir datos del usuario
const saveUserToLocalStorage = (userData) => {
    localStorage.setItem('userData', JSON.stringify({
        id: userData.id,
        name: userData.name,
        surname: userData.surname,
        organizationId: userData.organizationId,
        role: userData.role
    }));
};

const loadUserFromLocalStorage = () => {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
        try {
            return JSON.parse(userDataStr);
        } catch (e) {
            console.error('Error parsing user data from localStorage:', e);
            return null;
        }
    }
    return null;
};

const clearUserFromLocalStorage = () => {
    localStorage.removeItem('userData');
};

const useIamStore = defineStore('iam', () => {
    const users = ref([]);
    const errors = ref([]);
    const usersLoaded = ref(false);
    
    // Inicializar desde localStorage si hay token y datos de usuario
    const token = localStorage.getItem('token');
    const savedUserData = loadUserFromLocalStorage();
    const isSignedIn = ref(!!token);
    
    // Inicializar datos del usuario desde localStorage si existen
    const currentUserName = ref(savedUserData?.name || '');
    const currentUserSurname = ref(savedUserData?.surname || '');
    const currentUserOrganizationId = ref(savedUserData?.organizationId || '');
    const currentUserId = ref(savedUserData?.id || '');
    const currentUserRole = ref(savedUserData?.role || '');
    const currentUserToken = computed(() => isSignedIn.value ? localStorage.getItem('token') : null);

    function signIn(SignInCommand, router) {
        console.log(SignInCommand);
        iamApi.signIn(SignInCommand)
            .then(response => {
                let signInResource = SignInAssembler.toResourceFromResponse(response);
                if (signInResource) {
                    let currentUser = new User({
                        id: signInResource.id,
                        name: signInResource.name,
                        surname: signInResource.surname,
                        organizationId: signInResource.organizationId,
                        role: signInResource.role
                    });
                    currentUserName.value = currentUser.name;
                    currentUserSurname.value = currentUser.surname;
                    currentUserOrganizationId.value = currentUser.organizationId;
                    currentUserId.value = currentUser.id;
                    currentUserRole.value = currentUser.role;
                    
                    // Guardar token y datos del usuario en localStorage
                    localStorage.setItem('token', signInResource.token);
                    saveUserToLocalStorage({
                        id: currentUser.id,
                        name: currentUser.name,
                        surname: currentUser.surname,
                        organizationId: currentUser.organizationId,
                        role: currentUser.role
                    });
                    
                    isSignedIn.value = true;
                    console.log(`User ${currentUserName.value} signed in successfully.`);
                    errors.value = [];
                    // Si no tiene organizationId, redirigir a invitations, sino a management
                    if (!currentUser.organizationId) {
                        router.push({ name: 'invitations' });
                    } else {
                        router.push({ name: 'management' });
                    }
                } else {
                    isSignedIn.value = false;
                    console.log('Sign-in failed: Invalid response.');
                    errors.value.push(new Error("Invalid response."));
                    router.push({ name: 'iam-sign-in-up' });
                }
            })
            .catch(error => {
                isSignedIn.value = false;
                currentUserName.value = '';
                currentUserSurname.value = '';
                currentUserOrganizationId.value = '';
                currentUserId.value = '';
                currentUserRole.value = '';
                console.log(`Sign-in failed: ${error.message}`);
                errors.value.push(error);
                router.push({ name: 'iam-sign-in-up' });
            });
    }

    function signUp(SignUpCommand) {
        iamApi.signUp(SignUpCommand)
            .then(response => {
                let signUpResource = SignUpAssembler.toResourceFromResponse(response);
                if (signUpResource) {
                    console.log(`User ${signUpResource.email} signed up successfully.`);
                    errors.value = [];
                } else {
                    console.log('Sign-up failed: Invalid response.');
                    errors.value.push(new Error("Invalid response."));
                }
            })
            .catch(error => {
                console.log(`Sign-up failed: ${error.message}`);
                errors.value.push(error);
            });
    }

    /**
     * Inicializa el usuario desde el backend, validando el token
     * y actualizando los datos del usuario con información fresca.
     * Si falla, limpia todo el estado de autenticación.
     * 
     * Esta función se debe llamar al iniciar la app cuando hay un token en localStorage.
     * Los datos del cache (localStorage) se muestran primero para mejor UX,
     * y luego se actualizan con datos frescos del backend.
     */
    async function initializeUser() {
        const token = localStorage.getItem('token');
        
        // Si no hay token, no hay nada que inicializar
        if (!token) {
            return;
        }

        try {
            // Intentar obtener datos frescos del usuario desde el backend
            // Esto valida el token automáticamente
            const response = await iamApi.getCurrentUser();
            
            if (response.status === 200 && response.data) {
                // Actualizar store con datos frescos del backend
                const userData = response.data;
                
                currentUserId.value = userData.id || '';
                currentUserName.value = userData.name || '';
                currentUserSurname.value = userData.surname || '';
                currentUserOrganizationId.value = userData.organizationId || '';
                currentUserRole.value = userData.role || '';
                
                // Actualizar cache en localStorage con datos frescos
                saveUserToLocalStorage({
                    id: userData.id,
                    name: userData.name,
                    surname: userData.surname,
                    organizationId: userData.organizationId,
                    role: userData.role
                });
                
                isSignedIn.value = true;
                console.log('✅ Usuario inicializado y validado desde el backend');
            } else {
                // Si la respuesta no es válida, limpiar todo
                console.warn('⚠️ Respuesta inválida del backend, limpiando autenticación');
                clearAuth();
            }
        } catch (error) {
            // Si hay error (token inválido, expirado, etc.), limpiar todo
            console.error('❌ Error al inicializar usuario:', error);
            console.log('🔒 Token inválido o expirado, limpiando autenticación');
            clearAuth();
        }
    }

    /**
     * Limpia todo el estado de autenticación
     */
    function clearAuth() {
        localStorage.removeItem('token');
        clearUserFromLocalStorage();
        isSignedIn.value = false;
        currentUserName.value = '';
        currentUserSurname.value = '';
        currentUserOrganizationId.value = '';
        currentUserId.value = '';
        currentUserRole.value = '';
    }

    function signOut(router) {
        // Limpiar token y datos del usuario de localStorage
        clearAuth();
        
        console.log('User signed out successfully.');
        errors.value = [];
        router.push({ name: 'iam-sign-in-up' });
    }

    return {
        users,
        errors,
        usersLoaded,
        isSignedIn,
        currentUserName,
        currentUserSurname,
        currentUserOrganizationId,
        currentUserId,
        currentUserRole,
        currentUserToken,
        signIn,
        signUp,
        signOut,
        initializeUser
    };
});

export default useIamStore;

