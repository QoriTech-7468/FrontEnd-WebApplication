import useIamStore from "../application/iam.store.js";

export const iamInterceptor = (config) => {
    const store = useIamStore();
    if (store.isSignedIn) {
        config.headers.Authorization = `Bearer ${store.currentUserToken}`;
    }
    return config;
}