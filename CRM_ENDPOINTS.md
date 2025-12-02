# CRM API Endpoints Documentation

This document describes all the endpoints required for the CRM bounded context, covering Clients and Locations management.

## Environment Variables

The following environment variables should be configured:
- `VITE_RUTANA_CLIENTS_ENDPOINT_PATH` - Base path for clients endpoints
- `VITE_RUTANA_LOCATIONS_ENDPOINT_PATH` - Base path for locations endpoints

---

## Clients Endpoints

### 1. Get All Clients
**GET** `{VITE_RUTANA_CLIENTS_ENDPOINT_PATH}`

**Description**: Retrieves all clients from the organization (both active and inactive).

**Query Parameters**
- `isActive` (boolean) - Filter by active status. If not provided, returns all clients.

**Response**: `200 OK`
```json
[
  {
    "id": 0,
    "name": "string",
    "isActive": true
  }
]
```

**Used in**: `crm.store.js` → `fetchClients()`

**Note**: Currently fetches all clients. Consider adding query parameter support for filtering active clients.


---

### 2. Get Client by ID
**GET** `{VITE_RUTANA_CLIENTS_ENDPOINT_PATH}/{id}`

**Description**: Retrieves a specific client by its ID.

**Path Parameters**:
- `id` (number|string) - The client ID

**Query Parameters** (optional):
- `include` (string) - Comma-separated list of related resources to include. Options: `locations`

**Response** (without `include` parameter): `200 OK`
```json
{
  "id": 0,
  "name": "string",
  "isActive": true
}
```

**Response** (with `?include=locations`): `200 OK`
```json
{
  "id": 0,
  "name": "string",
  "isActive": true,
  "locations": [
    {
      "id": 0,
      "latitude": "string",
      "longitude": "string",
      "address": "string",
      "proximity": "string",
      "isActive": true,
      "clientId": 0
    }
  ]
}
```

**Used in**: `crm-api.js` → `getClientsById(id)`

**Note**: Use `?include=locations` when you need all locations associated with the client. For better performance, prefer using endpoint #3 (`GET /clients/{id}/locations`) when you only need locations.

---

### 3. Get Locations by Client ID 
**GET** `{VITE_RUTANA_CLIENTS_ENDPOINT_PATH}/{id}/locations`

**Description**: Retrieves all locations associated with a specific client. This endpoint automatically includes the client information in each location.

**Path Parameters**:
- `id` (number|string) - The client ID

**Response**: `200 OK`
```json
[
  {
    "id": 0,
    "latitude": "string",
    "longitude": "string",
    "address": "string",
    "proximity": "string",
    "isActive": true,
    "clientId": 0,
    "client": {
      "id": 0,
      "name": "string",
      "isActive": true
    }
  }
]
```

**Note**: This endpoint always includes the client information since locations are retrieved in the context of a specific client.

---

### 4. Create Client
**POST** `{VITE_RUTANA_CLIENTS_ENDPOINT_PATH}`

**Description**: Creates a new client.

**Request Body**:
```json
{
  "name": "string",
  "isActive": true
}
```

**Request Body Fields**:
- `name` (string, required) - Company/client name
- `isActive` (boolean, required) - Active status (default: true)

**Response**: `201 Created` or `200 OK`
```json
{
  "id": 0,
  "name": "string",
  "isActive": true
}
```

**Used in**: 
- `crm.store.js` → `addClients(client)`
- `add-clients.vue` → Creates client with `{ id: null, name: string, isActive: true }`

---

### 5. Update Client
**PUT** `{VITE_RUTANA_CLIENTS_ENDPOINT_PATH}/{id}`

**Description**: Updates an existing client.

**Path Parameters**:
- `id` (number|string) - The client ID

**Request Body**:
```json
{
  "id": 0,
  "name": "string",
  "isActive": true
}
```

**Request Body Fields**:
- `id` (number, required) - Client ID
- `name` (string, required) - Company/client name
- `isActive` (boolean, required) - Active status

**Response**: `200 OK`
```json
{
  "id": 0,
  "name": "string",
  "isActive": true
}
```

**Used in**: 
- `crm.store.js` → `updateClients(client)`
- `edit-client.vue` → Updates client with `{ id, name, isActive }`

---

### 6. Update Client Status (Activate/Deactivate)
**PATCH** `{VITE_RUTANA_CLIENTS_ENDPOINT_PATH}/{id}/status`

**Description**: Activates or deactivates a client (soft delete). Does not permanently delete the client, only changes its active status.

**Path Parameters**:
- `id` (number|string) - The client ID

**Request Body**:
```json
{
  "isActive": false
}
```

**Request Body Fields**:
- `isActive` (boolean, required) - `true` to activate, `false` to deactivate

**Response**: `200 OK`
```json
{
  "id": 0,
  "name": "string",
  "isActive": false
}
```

**Used in**: `crm.store.js` → `updateClientStatus(clientId, isActive)` or `deleteClients(clientId)` (if refactored)

---

## Locations Endpoints

### 1. Get All Locations
**GET** `{VITE_RUTANA_LOCATIONS_ENDPOINT_PATH}`

**Description**: Retrieves all locations from the organization (both active and inactive).

**Query Parameters**
- `isActive` (boolean) - Filter by active status. If not provided, returns all locations.
- `clientId` (number) - Filter by client ID. If provided, returns only locations for that client.

**Response**: `200 OK`
```json
[
  {
    "id": 0,
    "latitude": "string",
    "longitude": "string",
    "address": "string",
    "proximity": "string",
    "isActive": true,
  }
]
```

**Response Fields**:
- `id` (number) - Location ID
- `latitude` (string) - Latitude coordinate
- `longitude` (string) - Longitude coordinate
- `address` (string) - Physical address
- `proximity` (string) - Proximity type: "close", "mid", or "far"
- `isActive` (boolean) - Active status
- `clientId` (number) - Associated client ID

**Used in**: 
- `crm.store.js` → `fetchLocations()`
- `locations-tab.vue` → Fetches all locations for route planning

**Note**: Currently fetches all locations. Consider adding query parameter support for filtering.

---

---

### 2. Get Location by ID
**GET** `{VITE_RUTANA_LOCATIONS_ENDPOINT_PATH}/{id}`

**Description**: Retrieves a specific location by its ID.

**Path Parameters**:
- `id` (number|string) - The location ID

**Query Parameters** (optional):
- `include` (string) - Comma-separated list of related resources to include. Options: `client`

**Response** (without `include` parameter): `200 OK`
```json
{
  "id": 0,
  "latitude": "string",
  "longitude": "string",
  "address": "string",
  "proximity": "string",
  "isActive": true,
  "clientId": 0
}
```

**Response** (with `?include=client`): `200 OK`
```json
{
  "id": 0,
  "latitude": "string",
  "longitude": "string",
  "address": "string",
  "proximity": "string",
  "isActive": true,
  "clientId": 0,
  "client": {
    "id": 0,
    "name": "string",
    "isActive": true
  }
}
```

**Used in**: `crm-api.js` → `getLocationsById(id)`

**Note**: Use `?include=client` when you need the full Client information associated with the location.

---

### 3. Create Location
**POST** `{VITE_RUTANA_LOCATIONS_ENDPOINT_PATH}`

**Description**: Creates a new location for a client.

**Request Body**:
```json
{
  "clientId": 0,
  "address": "string",
  "latitude": "string",
  "longitude": "string",
  "proximity": "string",
  "isActive": true
}
```

**Request Body Fields**:
- `clientId` (number, required) - Associated client ID
- `address` (string, required) - Physical address
- `latitude` (string|number, required) - Latitude coordinate
- `longitude` (string|number, required) - Longitude coordinate
- `proximity` (string, required) - Proximity type: "close", "mid", or "far"
- `isActive` (boolean, required) - Active status (default: true)

**Response**: `201 Created` or `200 OK`
```json
{
  "id": 0,
  "latitude": "string",
  "longitude": "string",
  "address": "string",
  "proximity": "string",
  "isActive": true,
  "clientId": 0
}
```

**Used in**: 
- `crm.store.js` → `addLocation(location)`
- `add-location.vue` → Creates location with client association
- `clients.vue` → `handleCreateLocation(payload)`

**Note**: The frontend sends `clientId` in the request body.

---

### 4. Update Location
**PUT** `{VITE_RUTANA_LOCATIONS_ENDPOINT_PATH}/{id}`

**Description**: Updates an existing location.

**Path Parameters**:
- `id` (number|string) - The location ID

**Request Body**:
```json
{
  "id": 0,
  "latitude": "string",
  "longitude": "string",
  "address": "string",
  "proximity": "string",
  "isActive": true,
  "clientId": 0
}
```

**Request Body Fields**:
- `id` (number, required) - Location ID
- `latitude` (string|number, required) - Latitude coordinate
- `longitude` (string|number, required) - Longitude coordinate
- `address` (string, required) - Physical address
- `proximity` (string, required) - Proximity type: "close", "mid", or "far"
- `isActive` (boolean, required) - Active status
- `clientId` (number, required) - Associated client ID

**Response**: `200 OK`
```json
{
  "id": 0,
  "latitude": "string",
  "longitude": "string",
  "address": "string",
  "proximity": "string",
  "isActive": true,
  "clientId": 0
}
```

**Used in**: 
- `crm.store.js` → `updateLocation(location)`
- `edit-location.vue` → Updates location details
- `clients.vue` → `saveLocationEdit(updated)`

---

### 5. Update Location Status (Activate/Deactivate)
**PATCH** `{VITE_RUTANA_LOCATIONS_ENDPOINT_PATH}/{id}/status`

**Description**: Activates or deactivates a location (soft delete). Does not permanently delete the location, only changes its active status.

**Path Parameters**:
- `id` (number|string) - The location ID

**Request Body**:
```json
{
  "isActive": false
}
```

**Request Body Fields**:
- `isActive` (boolean, required) - `true` to activate, `false` to deactivate

**Response**: `200 OK`
```json
{
  "id": 0,
  "latitude": "string",
  "longitude": "string",
  "address": "string",
  "proximity": "string",
  "isActive": false,
  "clientId": 0
}
```

**Used in**: `crm.store.js` → `updateLocationStatus(locationId, isActive)` or `deleteLocation(locationId)` (if refactored)

---

## Summary Table

| Resource | Method | Endpoint | Purpose | Priority |
|----------|--------|----------|---------|----------|
| Clients | GET | `{CLIENTS_PATH}` | Get all clients | ✅ Required |
| Clients | GET | `{CLIENTS_PATH}?isActive=true` | Get active clients | ⚠️ Recommended |
| Clients | GET | `{CLIENTS_PATH}/{id}` | Get client by ID | ✅ Required |
| Clients | GET | `{CLIENTS_PATH}/{id}/locations` | Get locations by client ID | ⭐ **High Priority** |
| Clients | POST | `{CLIENTS_PATH}` | Create client | ✅ Required |
| Clients | PUT | `{CLIENTS_PATH}/{id}` | Update client | ✅ Required |
| Clients | PATCH | `{CLIENTS_PATH}/{id}/status` | Update client status (activate/deactivate) | ✅ Required |
| Locations | GET | `{LOCATIONS_PATH}` | Get all locations | ✅ Required |
| Locations | GET | `{LOCATIONS_PATH}?isActive=true` | Get active locations | ⚠️ Recommended |
| Locations | GET | `{LOCATIONS_PATH}/{id}` | Get location by ID | ✅ Required |
| Locations | POST | `{LOCATIONS_PATH}` | Create location | ✅ Required |
| Locations | PUT | `{LOCATIONS_PATH}/{id}` | Update location | ✅ Required |
| Locations | PATCH | `{LOCATIONS_PATH}/{id}/status` | Update location status (activate/deactivate) | ✅ Required |

---