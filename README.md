# NexusMesh

NexusMesh is a project exploring a decentralized mesh-connectivity prototype. It models Wi-Fi nodes, selects routes through a mesh according to location and network constraints, and demonstrates wallet-based access and smart-contract settlement.

## Project overview

- **Frontend:** React single-page application for wallet login, connection requests, and session history.
- **Orchestrator:** Node.js/Express API for authentication, node coordination, and requests to the other services.
- **C++ Engine:** gRPC service that manages the mesh graph, selects routes, and tracks reserved bandwidth.
- **Ledger:** Node.js service that settles sessions through the local smart contracts and stores history in PostgreSQL.
- **Smart contracts:** Solidity MESH token and ledger contracts, developed and tested on a local Hardhat chain.
- **Data stores:** MongoDB stores node records; PostgreSQL stores settled session history.

The Docker Compose setup runs the integrated local stack. A separate workflow is available for running services directly on the host. This is a student project, and the Compose setup is for local development—not production deployment.

## Getting started

See the [local development guide](Docs/local-development.md) for prerequisites, environment files, Docker Compose startup, and the manual host-based workflow.

## Documentation

- [Architecture and data flow](Docs/architecture.md)
- [Configuration reference](Docs/configuration.md)
- [HTTP API reference](Docs/api-reference.md)
- [Operations runbook](Docs/operations.md)
- Service guides:
  - [Frontend](Docs/services/frontend.md)
  - [Orchestrator](Docs/services/orchestrator.md)
  - [Ledger service](Docs/services/ledger.md)
  - [C++ Engine](Docs/services/engine.md)
  - [Smart contracts](Docs/services/contracts.md)

## Local development and data

The Compose setup uses named volumes for PostgreSQL and MongoDB. See the [operations runbook](Docs/operations.md) for stop/reset behavior and data persistence details.

Environment files are excluded from version control. Never commit private keys, wallet recovery phrases, session/JWT secrets, database credentials, or provider credentials. Frontend `VITE_*` values are included in browser-delivered code and must not contain secrets.
