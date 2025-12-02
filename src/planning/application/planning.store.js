import { defineStore } from 'pinia';
import { ref } from 'vue';
import PlanningApi from '../infrastructure/planning-api.js';
import { useRouter } from 'vue-router';
import { RouteDraft } from '../domain/route-draft.entity.js';

export const usePlanningStore = defineStore('planning', () => {
    const api = new PlanningApi();
    const router = useRouter();

    const routes = ref([]);
    const routeDrafts = ref([]);
    const vehicles = ref([]);
    const locations = ref([]);
    const deliveries = ref([]);
    const errors = ref([]);

    const selectedRoute = ref(null);
    const currentRoute = ref(null);

    // SIMULACION DE USUARIOS, cambiar dependiendo del id del trasnportista logueado

    const CURRENT_DRIVER_ID = 2;

    async function fetchAllRoutes() {
        try {
            const data = await api.getAllRoutes();
            routes.value = data;
            return data;
        } catch (err) {
            console.error('Error fetching routes', err);
            errors.value.push(err);
            throw err;
        }
    }

    /**
     * Get route drafts by execution date
     * @param {string} executionDate - Execution date in ISO date-time format
     * @returns {Promise} - A promise resolving to the list of route drafts
     */
    async function fetchRouteDrafts(executionDate) {
        try {
            const response = await api.getRouteDrafts(executionDate);
            routeDrafts.value = response.data || [];
            return routeDrafts.value;
        } catch (err) {
            console.error('Error fetching route drafts', err);
            errors.value.push(err);
            throw err;
        }
    }

    /**
     * Get routes by execution date
     * @param {string} executionDate - Execution date in ISO date-time format
     * @returns {Promise} - A promise resolving to the list of routes
     */
    async function fetchRoutes(executionDate) {
        try {
            const response = await api.getRoutes(executionDate);
            routes.value = response.data || [];
            return routes.value;
        } catch (err) {
            console.error('Error fetching routes', err);
            errors.value.push(err);
            throw err;
        }
    }

    /**
     * Create a new route draft
     * @param {Object} routeDraftData - Route draft data with colorCode and executionDate
     * @returns {Promise<RouteDraft>} - A promise resolving to the created route draft
     */
    async function createRouteDraft(routeDraftData) {
        try {
            const routeDraft = new RouteDraft({
                colorCode: routeDraftData.colorCode || '#003087',
                executionDate: routeDraftData.executionDate || null
            });
            const created = await api.createRouteDraft(routeDraft);
            routeDrafts.value.push(created);
            return created;
        } catch (err) {
            console.error('Error creating route draft', err);
            errors.value.push(err);
            throw err;
        }
    }

    async function getRouteById(routeId) {
        try {
            const route = await api.getRouteById(routeId);
            const idx = routes.value.findIndex(r => r.id == routeId);
            if (idx !== -1) {
                routes.value[idx] = route;
            } else {
                routes.value.push(route);
            }
            return route;
        } catch (err) {
            console.error('Error fetching single route', err);
            errors.value.push(err);
            throw err;
        }
    }

    async function fetchAllVehicles() {
        try {
            vehicles.value = await api.getAllVehicles();
            return vehicles.value;
        } catch (err) {
            console.error('Error fetching vehicles', err);
            errors.value.push(err);
            throw err;
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
            console.error('Error fetching and selecting route', err);
            errors.value.push(err);
            selectedRoute.value = null;
            throw err;
        }
    }

    async function createDraftRoute(routeData) {
        try {
            const newRoute = await api.createRoute({
                ...routeData,
                state: 'draft'
            });
            routes.value.push(newRoute);
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

    async function publishRoute(routeId) {
        try {
            const updated = await api.publishRoute(routeId);
            const idx = routes.value.findIndex(r => r.id === routeId);
            if (idx !== -1) {
                routes.value[idx] = updated;
            }
            return updated;
        } catch (err) {
            console.error('Error publishing route', err);
            errors.value.push(err);
            throw err;
        }
    }

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

    async function fetchTransportistRoute() {
        try {
            const currentUser = await api.getUserById(CURRENT_DRIVER_ID);

            if (!currentUser || !currentUser.vehicleId) {
                console.warn('Driver no tiene vehículo asignado');
                currentRoute.value = null;
                deliveries.value = [];
                locations.value = [];
                return null;
            }

            console.log(`🚗 Driver: ${currentUser.fullname}, Vehicle: ${currentUser.vehicleId}`);

            const allRoutes = await api.getAllRoutes();
            const driverRoute = allRoutes.find(r =>
                r.state === 'published' &&
                String(r.vehicleId) === String(currentUser.vehicleId)
            );

            if (!driverRoute) {
                console.warn('No hay rutas publicadas para este vehículo');
                currentRoute.value = null;
                deliveries.value = [];
                locations.value = [];
                return null;
            }

            console.log(`Ruta encontrada: ${driverRoute.id}`);
            console.log(`driverRoute completo:`, driverRoute);
            console.log(`driverRoute.locations:`, driverRoute.locations);
            console.log(`DEBUG - Es array?:`, Array.isArray(driverRoute.locations));
            currentRoute.value = driverRoute;

            // ✅ SOLUCIÓN: Usar SOLO las locations de la ruta
            if (driverRoute.locations && Array.isArray(driverRoute.locations) && driverRoute.locations.length > 0) {
                locations.value = driverRoute.locations.map(loc => ({
                    ...loc,
                    customerId: loc.customerId || loc.clientsId || null,
                    type: loc.type || 'store'
                }));
                console.log(`✅ Locations cargadas desde la ruta: ${locations.value.length}`);
            } else {
                console.warn('⚠️ Ruta sin locations embebidas');
                locations.value = [];
            }

            // Cargar deliveries existentes
            await fetchDeliveriesByRoute(driverRoute.id);

            // Auto-crear deliveries si no existen
            if (deliveries.value.length === 0 && locations.value.length > 0) {
                console.log('⚠️ No hay deliveries, creando automáticamente...');
                await autoCreateDeliveries(driverRoute.id);
            }

            return driverRoute;
        } catch (err) {
            console.error('Error fetching transportist route', err);
            errors.value.push(err);
            throw err;
        }
    }

    async function autoCreateDeliveries(routeId) {
        try {
            // ✅ SOLUCIÓN CRÍTICA: Usar SOLO las locations del currentRoute
            // NO usar locations.value global
            if (!currentRoute.value || !currentRoute.value.locations) {
                console.warn('No hay locations en currentRoute para crear deliveries');
                return [];
            }

            const routeLocations = currentRoute.value.locations;
            console.log(`📦 Creando deliveries para ${routeLocations.length} locations de la ruta...`);

            const newDeliveries = [];

            for (const loc of routeLocations) {
                // Verificar que no exista ya
                const existingDelivery = deliveries.value.find(
                    d => d.routeId === routeId && d.locationId === loc.id
                );

                if (existingDelivery) {
                    console.log(`⏭️ Ya existe delivery para location ${loc.id}, saltando...`);
                    continue;
                }

                const delivery = await api.createDelivery({
                    routeId: routeId,
                    locationId: loc.id,
                    state: 'pending',
                    rejectionReason: null,
                    rejectionNote: null,
                    evidenceUrl: null,
                    createdAt: new Date().toISOString(),
                    updatedAt: null
                });

                newDeliveries.push(delivery);
                console.log(`✅ Delivery creado para location ${loc.id}`);
            }

            deliveries.value = [...deliveries.value, ...newDeliveries];
            console.log(`✅ Total: ${newDeliveries.length} nuevos deliveries creados`);

            return newDeliveries;
        } catch (err) {
            console.error('Error auto-creating deliveries', err);
            throw err;
        }
    }

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

    async function completeDelivery(deliveryId, evidenceUrl = null) {
        try {
            const updated = await api.updateDelivery(deliveryId, {
                state: 'completed',
                evidenceUrl: evidenceUrl,
                updatedAt: new Date().toISOString()
            });

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

    async function rejectDelivery(deliveryId, reason, note = '') {
        try {
            const updated = await api.updateDelivery(deliveryId, {
                state: 'rejected',
                rejectionReason: reason,
                rejectionNote: note,
                updatedAt: new Date().toISOString()
            });

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

    async function startDelivery(deliveryId) {
        try {
            const updated = await api.updateDelivery(deliveryId, {
                state: 'in_progress',
                updatedAt: new Date().toISOString()
            });

            const idx = deliveries.value.findIndex(d => d.id === deliveryId);
            if (idx !== -1) {
                deliveries.value[idx] = updated;
            }

            return updated;
        } catch (err) {
            console.error('Error starting delivery', err);
            errors.value.push(err);
            throw err;
        }
    }

    return {
        routes,
        routeDrafts,
        vehicles,
        locations,
        deliveries,
        errors,
        selectedRoute,
        currentRoute,
        CURRENT_DRIVER_ID,
        fetchAllRoutes,
        fetchRouteDrafts,
        fetchRoutes,
        createRouteDraft,
        getRouteById,
        fetchAllVehicles,
        fetchLocationsByRoute,
        fetchAndSelectRoute,
        createDraftRoute,
        saveDraftRoute,
        publishRoute,
        deleteDraftRoute,
        fetchTransportistRoute,
        fetchDeliveriesByRoute,
        completeDelivery,
        rejectDelivery,
        startDelivery,
        autoCreateDeliveries
    };
});

