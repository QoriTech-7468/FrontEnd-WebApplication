import useIamStore from "../application/iam.store";

export const authenticationGuard = (to, from, next) => {
    const store = useIamStore();
    const isAnonymous = !store.isSignedIn;
    const publicRoutes = ['iam-sign-in-up', 'page-not-found'];
    const routeRequiresToBeAuthenticated = !publicRoutes.includes(to.path);
    if(isAnonymous && routeRequiresToBeAuthenticated) {
        next({ name: 'iam-sign-in-up' });
    }
    else next();
}