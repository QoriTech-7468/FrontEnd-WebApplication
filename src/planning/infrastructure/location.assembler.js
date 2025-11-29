export class LocationAssembler {
    static toEntityFromResource(resource = {}) {
        return {
            id: resource.id ?? null,
            customerId: resource.customerId ?? resource.clientId ?? null,
            latitude: resource.latitude ?? null,
            longitude: resource.longitude ?? null,
            address: resource.address ?? '',
            type: resource.type ?? 'store',
            isActive: !!resource.isActive
        };
    }

    static toEntitiesFromResponse(response) {
        const data = response?.data ?? response;
        const resources = Array.isArray(data) ? data : (data?.locations ?? data ?? []);
        return resources.map(r => this.toEntityFromResource(r));
    }
}
export default LocationAssembler;
