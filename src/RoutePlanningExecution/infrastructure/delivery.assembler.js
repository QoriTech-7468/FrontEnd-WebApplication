export class DeliveryAssembler {
    static toEntityFromResource(resource = {}) {
        return {
            id: resource.id ?? null,
            routeId: resource.routeId ?? null,
            locationId: resource.locationId ?? null,
            state: resource.state ?? 'pending',
            rejectionReason: resource.rejectionReason ?? null,
            rejectionNote: resource.rejectionNote ?? null,
            evidenceUrl: resource.evidenceUrl ?? null,
            createdAt: resource.createdAt ?? null,
            updatedAt: resource.updatedAt ?? null
        };
    }

    static toEntitiesFromResponse(response) {
        const data = response?.data ?? response;
        const resources = Array.isArray(data) ? data : (data?.deliveries ?? data ?? []);
        return resources.map(r => this.toEntityFromResource(r));
    }
}
export default DeliveryAssembler;
