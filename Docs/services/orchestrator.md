# Orchestrator

## Responsibility

The Orchestrator is the public-facing Node.js/Express backend. It verifies wallet-signed login challenges, manages user/session state, validates connection requests, coordinates node registration, calls the C++ Engine over gRPC, and calls the Ledger service over HTTP.

## Dependencies and defaults

- HTTP port: `3000`
- MongoDB database name: `wifi_node_db`
- Engine gRPC URL: `http://localhost:50051`
- Ledger HTTP URL: `http://localhost:5000`
- EVM JSON-RPC URL: `http://localhost:8545`

See [configuration](../configuration.md#orchestrator) for the complete variable list.

## Data

The `WifiNode` Mongoose model stores node ID, wallet/IP, coordinates, total and available bandwidth, gateway status, latency, and registration time. Node data is copied into the Engine during initial synchronization.

## Authentication and sessions

The login flow stores a five-minute challenge in Express session state, verifies an Ethereum signed message, then issues a JWT in the `AccessToken` cookie. Authenticated frontend routes use the `verifyJWT` middleware. Connection reservation state is stored in the Express session.

The Express session store is configured by the Orchestrator application and carries authentication challenges and active connection details.

## Route groups

- `/api/v1/frontend`: user login, logout, current user, history, connect, and disconnect.
- `/api/v1/pseudo_node`: registration, add, and remove node operations.

Detailed methods and payloads are in the [HTTP API reference](../api-reference.md).

## Development

Install dependencies with `npm ci` and start with `npm start`. The Orchestrator requires MongoDB, generated Connect/Protobuf JavaScript modules, and a reachable Engine for mesh operations. Node registration also queries the configured EVM contract.
