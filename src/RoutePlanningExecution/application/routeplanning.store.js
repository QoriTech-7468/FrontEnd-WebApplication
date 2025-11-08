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
    const deliveries = ref([]);
    const currentRoute = ref(null);
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

    // --- TRANSPORTIST FUNCTIONS ---

    // Obtener la ruta asignada al transportista (por ahora obtenemos la primera publicada)
    async function fetchTransportistRoute() {
        try {
            const allRoutes = await api.getAllRoutes();
            // Por ahora obtenemos la primera ruta publicada
            const publishedRoute = allRoutes.find(r => r.state === 'published');

            if (publishedRoute) {
                currentRoute.value = publishedRoute;
                // Cargar deliveries de esta ruta
                await fetchDeliveriesByRoute(publishedRoute.id);
                return publishedRoute;
            }

            currentRoute.value = null;
            deliveries.value = [];
            return null;
        } catch (err) {
            console.error('Error fetching transportist route', err);
            errors.value.push(err);
            throw err;
        }
    }

    // Obtener deliveries de una ruta específica
    async function fetchDeliveriesByRoute(routeId) {
        try {
            const data = await api.getDeliveriesByRoute(routeId);
            deliveries.value = data;
            return data;
        } catch (err) {
            console.error('Error fetching deliveries by route', err);
            errors.value.push(err);
            throw err;
        }
    }

    // Completar un delivery
    async function completeDelivery(deliveryId) {
        try {
            const updated = await api.updateDelivery(deliveryId, {
                state: 'completed',
                updatedAt: new Date().toISOString()
            });

            // Actualizar en el array local
            const idx = deliveries.value.findIndex(d => d.id === deliveryId);
            if (idx !== -1) {
                deliveries.value[idx] = updated;
            }

            return updated;
        } catch (err) {
            console.error('Error completing delivery', err);
            errors.value.push(err);
            throw err;
        }
    }

    // Rechazar un delivery
    async function rejectDelivery(deliveryId, reason, note) {
        try {
            const updated = await api.updateDelivery(deliveryId, {
                state: 'rejected',
                rejectionReason: reason,
                rejectionNote: note,
                updatedAt: new Date().toISOString()
            });

            // Actualizar en el array local
            const idx = deliveries.value.findIndex(d => d.id === deliveryId);
            if (idx !== -1) {
                deliveries.value[idx] = updated;
            }

            return updated;
        } catch (err) {
            console.error('Error rejecting delivery', err);
            errors.value.push(err);
            throw err;
        }
    }

    return {
        routes,
        vehicles,
        locations,
        deliveries,
        currentRoute,
        errors,
        fetchAllRoutes,
        fetchAllVehicles,
        createDraftRoute,
        saveDraftRoute,
        publishRoute,
        deleteDraftRoute,
        fetchLocationsByRoute,
        // Transportist functions
        fetchTransportistRoute,
        fetchDeliveriesByRoute,
        completeDelivery,
        rejectDelivery
    };
});