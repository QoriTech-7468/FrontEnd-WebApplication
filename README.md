# Rutana - Logistics Management Platform

## Introduction

**Rutana** is a comprehensive web platform designed for transporters and logistics companies in Peru. The application provides a complete solution for managing routes, deliveries, vehicles, clients, and team members, enabling efficient logistics operations with real-time tracking and advanced administrative capabilities.

### Key Features

- **Complete Route and Order Management**: Plan, create, and monitor delivery routes efficiently
- **Tracking**: Track vehicles and deliveries
- **Advanced Administrative Panel**: Manage clients, vehicles, team members, and organizations
- **Detailed Reports and Analytics**: Generate insights for better decision-making
- **Multi-role Support**: Different user roles (Owner, Administrator, Dispatcher, Driver) with appropriate permissions
- **Organization Management**: Multi-tenant support with organization-based access control

---

## Architecture

This application follows a **Domain-Driven Design (DDD)** approach with **Bounded Contexts** and a **layered architecture**. Each bounded context represents a distinct business domain and is organized into four main layers:

### Bounded Contexts

1. **IAM (Identity and Access Management)**: User authentication, authorization, and invitation management
2. **CRM (Customer Relationship Management)**: Client and location management
3. **Fleets**: Vehicle and team member management
4. **Planning**: Route planning and delivery management
5. **Subscriptions**: Organization subscription management

### Architecture Layers

Each bounded context follows a consistent layered structure:

```
bounded-context/
├── application/          # Application layer (business logic orchestration)
├── domain/               # Domain layer (business entities and rules)
├── infrastructure/       # Infrastructure layer (external services, APIs)
└── presentation/         # Presentation layer (UI components and views)
```

#### 1. Application Layer (`application/`)

Contains the **application services** and **state management**:

- **Store Pattern**: One store per bounded context, named after the BC (e.g., `iam.store.js`)
- **Responsibilities**:
  - Orchestrates business logic
  - Manages application state using Pinia
  - Coordinates between domain and infrastructure layers
  - Handles user interactions and workflows

**Naming Convention**: `{bounded-context}.store.js`

Examples:
- `iam.store.js` - IAM bounded context store
- `planning.store.js` - Planning bounded context store
- `crm.store.js` - CRM bounded context store

#### 2. Domain Layer (`domain/`)

Contains **business entities** and **domain models**:

- **Entities**: Represent core business concepts
- **Commands** (IAM only): Represent user intents (e.g., `sign-in-command.js`, `sign-up-command.js`)
  - **Note**: Commands are only used in the IAM bounded context. Other bounded contexts do not use commands.

**Naming Conventions**:
- **Entities**: `{entity-name}.entity.js` (e.g., `user.entity.js`, `vehicle.entity.js`)
- **Commands** (IAM only): `{action}-command.js` (e.g., `sign-in-command.js`)
- **Organization**: Some BCs use `model/` subdirectory (e.g., `domain/model/client.entity.js`)

Examples:
- `iam/domain/user.entity.js`
- `iam/domain/sign-in-command.js`
- `crm/domain/model/client.entity.js`
- `fleets/domain/model/vehicle.entity.js`

#### 3. Infrastructure Layer (`infrastructure/`)

Contains **external integrations** and **data transformation**:

- **API Classes**: One API class per bounded context
- **Assemblers**: Transform between resources (API responses) and entities
- **Resources**: DTOs (Data Transfer Objects) representing API request/response structures
- **Interceptors & Guards**: HTTP interceptors and route guards (IAM only)

**Naming Conventions**:
- **API**: `{bounded-context}-api.js` or `{bounded-context}-api.js` (e.g., `iam-api.js`, `route-planning-api.js`)
- **Assemblers**: `{entity}.assembler.js` (e.g., `user.assembler.js`, `vehicle.assembler.js`)
- **Resources**: `{entity}.resource.js` (e.g., `invitation.resource.js`, `sign-in.resource.js`)

Examples:
- `iam/infrastructure/iam-api.js`
- `iam/infrastructure/user.assembler.js`
- `iam/infrastructure/invitation.resource.js`
- `iam/infrastructure/authentication.guard.js`
- `iam/infrastructure/iam.interceptor.js`

#### 4. Presentation Layer (`presentation/`)

Contains **UI components** and **views**:

- **Components**: Reusable UI units (kebab-case naming)
- **Views**: Full pages that compose components (kebab-case naming)
- **Routes**: Route definitions specific to the bounded context

**Naming Conventions**:
- **Components**: `{component-name}.vue` (kebab-case, e.g., `invitation-card.vue`, `invitations-header.vue`)
- **Views**: `{view-name}.vue` (kebab-case, e.g., `login-register.vue`, `invitations.vue`)
- **Routes**: `{bounded-context}-route.js` (e.g., `iam-route.js`, `routing-route.js`)

**Directory Structure**:
```
presentation/
├── components/          # Reusable UI components
├── views/              # Full page views
├── dialogs/            # Dialog/modal components (optional)
└── {bc}-route.js       # Route definitions
```

Examples:
- `iam/presentation/components/invitation-card.vue`
- `iam/presentation/views/login-register.vue`
- `iam/presentation/iam-route.js`
- `fleets/presentation/dialogs/add-vehicle.vue`

---

## Naming Conventions Summary

### Files and Directories

| Type | Convention | Example |
|------|-----------|---------|
| **Store** | `{bc}.store.js` | `iam.store.js` |
| **Entity** | `{name}.entity.js` | `user.entity.js` |
| **Command** (IAM only) | `{action}-command.js` | `sign-in-command.js` |
| **API** | `{bc}-api.js` | `iam-api.js` |
| **Assembler** | `{entity}.assembler.js` | `user.assembler.js` |
| **Resource** | `{entity}.resource.js` | `invitation.resource.js` |
| **Component** | `{name}.vue` (kebab-case) | `invitation-card.vue` |
| **View** | `{name}.vue` (kebab-case) | `login-register.vue` |
| **Route** | `{bc}-route.js` | `iam-route.js` |

### Code Style

- **JavaScript/Vue**: Use camelCase for variables and functions
- **Vue Components**: Use PascalCase in templates, kebab-case in file names
- **Comments**: All comments must be in English
- **Console Messages**: All console messages must be in English

---

## Project Structure

```
src/
├── iam/                    # Identity and Access Management
│   ├── application/
│   │   └── iam.store.js
│   ├── domain/
│   │   ├── user.entity.js
│   │   ├── invitation.entity.js
│   │   ├── sign-in-command.js
│   │   └── sign-up-command.js
│   ├── infrastructure/
│   │   ├── iam-api.js
│   │   ├── authentication.guard.js
│   │   ├── iam.interceptor.js
│   │   ├── *.assembler.js
│   │   └── *.resource.js
│   └── presentation/
│       ├── components/
│       ├── views/
│       └── iam-route.js
├── crm/                    # Customer Relationship Management
├── fleets/                 # Fleet Management
├── planning/               # Route Planning
├── subscriptions/         # Organization Subscriptions
└── shared/                 # Shared utilities and components
    ├── infrastructure/
    └── presentation/
```

---

## Key Architectural Principles

1. **One Store Per Bounded Context**: Each BC has a single store that manages all its state
2. **Commands Only in IAM**: Commands are a special pattern used only in the IAM bounded context
3. **Kebab-case for Vue Files**: All Vue component and view files use kebab-case naming
4. **Separation of Concerns**: Each layer has clear responsibilities
5. **English Documentation**: All comments, messages, and documentation are in English

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

---

## Technologies

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **Pinia** - State management
- **Vue Router** - Official router for Vue.js
- **PrimeVue** - UI component library
- **PrimeFlex** - CSS utility library

---

## License

This project is part of a university final project.
