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

    // --- CARGA INICIAL ---
    async function fetchAllRoutes() {
        try {
            const data = await api.getAllRoutes();
            routes.value = data;
        } catch (err) {
            console.error('Error fetching routes', err);
            errors.value.push(err);
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

    // --- CREAR DRAFT ---
    async function createDraftRoute(routeData) {
        try {
            const newRoute = await api.createRoute({
                ...routeData,
                state: 'draft'
            });
            routes.value.push(newRoute);

            // ✅ Redireccionar a la lista
            router.push('/management/routes/list');
            return newRoute;
        } catch (err) {
            console.error('Error creating draft route', err);
            errors.value.push(err);
            throw err;
        }
    }

    async function saveDraftRoute(routeData) {
        try {
            // Si la ruta tiene id, actualizamos; sino, creamos
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

            // Actualizamos la lista local
            await fetchAllRoutes();

            // Redirigimos a la lista principal
            router.push('/management/routes/list');

            return savedRoute;
        } catch (err) {
            console.error('Error saving draft route', err);
            errors.value.push(err);
            throw err;
        }
    }

    // --- PUBLICAR RUTA ---
    async function publishRoute(routeId) {
        try {
            const updated = await api.publishRoute(routeId);

            // actualizar localmente
            const idx = routes.value.findIndex(r => r.id === routeId);
            if (idx !== -1) routes.value[idx] = updated;

            // ✅ Redireccionar a la lista
            router.push('/management/routes/list');
            return updated;
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

            // eliminar del array local
            routes.value = routes.value.filter(r => r.id !== routeId);

            // ✅ Redireccionar a la lista
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
        fetchAllRoutes,
        fetchAllVehicles,
        createDraftRoute,
        saveDraftRoute,
        publishRoute,
        deleteDraftRoute,
        fetchLocationsByRoute
    };
});
