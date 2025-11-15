export class RouteAssembler {
    static toEntityFromResource(resource = {}) {
        return {
            id: resource.id ?? null,
            vehicleId: resource.vehicleId ?? null,
            state: resource.state ?? 'draft',
            color: resource.color ?? '#FFFFFF',
            createdAt: resource.createdAt ?? null,
            startedAt: resource.startedAt ?? null,
            finishedAt: resource.finishedAt ?? null,
            meta: resource.meta ?? {}
        };
    }

    static toEntitiesFromResponse(response) {
        // response puede ser axios response o array
        const data = response?.data ?? response;
        const resources = Array.isArray(data) ? data : (data?.routes ?? data ?? []);
        return resources.map(r => this.toEntityFromResource(r));
    }
}
export default RouteAssembler;
