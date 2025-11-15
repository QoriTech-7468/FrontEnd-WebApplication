import { defineStore } from 'pinia';
import { ref } from 'vue';
import RoutePlanningApi from '../infrastructure/route-planning-api.js';
import { useRouter } from 'vue-router';

export const useRoutePlanningStore = defineStore('routeplanning', () => {
    const api = new RoutePlanningApi();
    const router = useRouter();

    const routes = ref([]);
    const vehicles = ref([]);
    const locations = ref([]);
    const errors = ref([]);

    const selectedRoute = ref(null);

    async function fetchAndSelectRoute(routeId) {
        try {
            const route = await getRouteById(routeId);

            if (route) {
                selectedRoute.value = route;
                locations.value = route.locations || [];

            } else {
                console.error(`Route with id ${routeId} not found.`);
                selectedRoute.value = null;
                locations.value = [];
            }
            return route;
        } catch (err) {
            console.error('Error fetching route', err);
            errors.value.push(err);
            selectedRoute.value = null;
        }
    }

    async function fetchLocationsByRoute(routeId) {
        try {
            const data = await api.getLocationsByRoute(routeId);
            locations.value = data;
            return data;
        } catch (err) {
            console.error('Error fetching locations by route', err);
            errors.value.push(err);
            throw err;
        }
    }


    async function fetchAllVehicles() {
        try {
            vehicles.value = await api.getAllVehicles();
        } catch (err) {
            console.error('Error fetching vehicles', err);
            errors.value.push(err);
        }
    }

    async function getRouteById(routeId) {
        try {
            const route = await api.getRouteById(routeId); // Llama a la API por 1 ruta

            const idx = routes.value.findIndex(r => r.id == routeId);
            if (idx !== -1) routes.value[idx] = route;
            else routes.value.push(route);

            return route;
        } catch (err) {
            console.error('Error fetching single route', err);
            errors.value.push(err);
            throw err;
        }
    }

    async function fetchAllRoutes() {
        try {
            const data = await api.getAllRoutes();
            routes.value = data;
        } catch (err) {
            console.error('Error fetching routes', err);
            errors.value.push(err);
        }
    }

    async function createDraftRoute(routeData) {
        try {
            const newRoute = await api.createRoute({
                ...routeData,
                state: 'draft'
            });
            routes.value.push(newRoute);

            //  Redireccionar a la lista
            router.push('/management/routes/list');
            return newRoute;
        } catch (err) {
            console.error('Error creating draft route', err);
            errors.value.push(err);
            throw err;
        }
    }

    // ...
    async function saveDraftRoute(routeData) {
        try {
            let savedRoute;
            if (routeData.id) {
                savedRoute = await api.updateRoute(routeData.id, {
                    ...routeData,
                    state: 'draft',
                });
            } else {
                savedRoute = await api.createRoute({
                    ...routeData,
                    state: 'draft',
                });
            }

            const index = routes.value.findIndex(r => r.id === savedRoute.id);
            if (index !== -1) {
                routes.value[index] = savedRoute;
            } else {
                routes.value.push(savedRoute);
            }
            return savedRoute;
        } catch (err) {
            console.error('Error saving draft route', err);
            errors.value.push(err);
            throw err;
        }
    }
// ...

    async function publishRoute(routeId) {
        try {
            const updated = await api.publishRoute(routeId);
            const idx = routes.value.findIndex(r => r.id === routeId);
            if (idx !== -1) {
                routes.value[idx].state = updated.state;
            }

            return routes.value[idx];
        } catch (err) {
            console.error('Error publishing route', err);
            errors.value.push(err);
            throw err;
        }
    }

    // --- ELIMINAR DRAFT ---
    async function deleteDraftRoute(routeId) {
        try {
            await api.deleteRoute(routeId);

            routes.value = routes.value.filter(r => r.id !== routeId);

            await router.push('/management/routes/list');
            return true;
        } catch (err) {
            console.error('Error deleting draft route', err);
            errors.value.push(err);
            throw err;
        }
    }



    return {
        routes,
        vehicles,
        locations,
        errors,
        selectedRoute,
        fetchAllRoutes,
        fetchAllVehicles,
        fetchLocationsByRoute,
        fetchAndSelectRoute,
        getRouteById,
        createDraftRoute,
        saveDraftRoute,
        publishRoute,
        deleteDraftRoute
    };
});
