import { IamApi } from "../infrastructure/iam-api.js";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { SignInAssembler } from "../infrastructure/sign-in.assembler.js";
import { SignUpAssembler } from "../infrastructure/sign-up.assembler.js";
import { User } from "../domain/user.entity.js";

const iamApi = new IamApi();

const useIamStore = defineStore('iam', () => {
    const users = ref([]);
    const errors = ref([]);
    const usersLoaded = ref(false);
    
    // Inicializar isSignedIn desde localStorage si hay token
    const token = localStorage.getItem('token');
    const isSignedIn = ref(!!token);
    
    const currentUserName = ref('');
    const currentUserSurname = ref('');
    const currentUserOrganizationId = ref('');
    const currentUserId = ref('');
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
                        organizationId: signInResource.organizationId
                    });
                    currentUserName.value = currentUser.name;
                    currentUserSurname.value = currentUser.surname;
                    currentUserOrganizationId.value = currentUser.organizationId;
                    currentUserId.value = currentUser.id;
                    localStorage.setItem('token', signInResource.token);
                    isSignedIn.value = true;
                    console.log(`User ${currentUserName.value} signed in successfully.`);
                    errors.value = [];
                    router.push({ name: 'management' });
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

    function signOut(router) {
        localStorage.removeItem('token');
        isSignedIn.value = false;
        currentUserName.value = '';
        currentUserSurname.value = '';
        currentUserOrganizationId.value = '';
        currentUserId.value = '';
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
        currentUserToken,
        signIn,
        signUp,
        signOut
    };
});

export default useIamStore;

