# Orchestrator

## Responsibility

The Orchestrator is the public-facing Node.js/Express backend. It verifies wallet-signed login challenges, manages user/session state, validates connection requests, coordinates node registration, calls the C++ Engine over gRPC, and calls the Ledger service over HTTP.

## Dependencies and defaults

- HTTP port: `3000`
- MongoDB database name: `wifi_node_db`
- Compose Engine gRPC URL: `engine:50051`
- Compose Ledger HTTP URL: `http://ledger:5000`
- Compose EVM JSON-RPC URL: `http://hardhat-node:8545`
- Compose MongoDB URL: `mongodb://mongodb:27017`

See [configuration](../configuration.md#orchestrator) for the complete variable list.

The Compose service publishes Orchestrator on `127.0.0.1:3000`, waits for MongoDB, Engine, and Ledger health checks, and loads `Orchestrator/.env` through a read-only bind mount. Its image runs Node directly so the process can receive Docker's shutdown signal.

## Data

The `WifiNode` Mongoose model stores node ID, wallet/IP, coordinates, total and available bandwidth, gateway status, latency, and registration time. Node data is copied into the Engine during initial synchronization.

## Authentication and sessions

The login flow stores a five-minute challenge in Express session state, verifies an Ethereum signed message, then issues a JWT in the `AccessToken` cookie. Authenticated frontend routes use the `verifyJWT` middleware. Connection reservation state is stored in the Express session.

The Express session store is configured by the Orchestrator application and carries authentication challenges and active connection details.

No persistent session store is configured, so `express-session` uses its in-memory `MemoryStore`. This is suitable only for local project use: sessions disappear on restart and are not shared across instances.

## Shutdown and MongoDB data

On SIGINT or SIGTERM, the current shutdown path calls `disconnectDB()`, which drops the `WifiNode` collection before disconnecting from MongoDB. Thus stopping Orchestrator (including `docker compose down`) removes those node documents from `wifi_node_db`, even though the Compose `mongodb_data` volume remains. Other MongoDB collections are not dropped.

## Route groups

- `/api/v1/frontend`: user login, logout, current user, history, connect, and disconnect.
- `/api/v1/pseudo_node`: registration, add, and remove node operations.

Detailed methods and payloads are in the [HTTP API reference](../api-reference.md).

## Development

Install dependencies with `npm ci` and start with `npm start`. The Orchestrator requires MongoDB, generated Connect/Protobuf JavaScript modules, and a reachable Engine for mesh operations. Node registration also queries the configured EVM contract.
