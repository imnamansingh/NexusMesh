# Architecture

## Components

| Component | Responsibility | Current interface |
|---|---|---|
| Frontend | React single-page app, wallet interaction, login, connection controls, and session history | Browser HTTP requests to Orchestrator; MetaMask provider for wallet transactions |
| Orchestrator | Wallet-signature authentication, user-facing HTTP API, node synchronization, and routing requests | Express HTTP on port `3000`; MongoDB; gRPC client; Ledger HTTP client; JSON-RPC client |
| C++ Engine | Mesh node index, adjacency data, path selection, and bandwidth availability | gRPC server on port `50051` |
| Ledger service | Contract settlement and session-history persistence | Express HTTP on port `5000`; Hardhat/EVM JSON-RPC; PostgreSQL through Prisma |
| Contracts | MESH ERC-20 token and node registration/token settlement rules | EVM JSON-RPC; deployed `MeshToken` and `NexusMeshLedger` contracts |
| MongoDB | Stores Orchestrator-side Wi-Fi node records | Mongoose database `wifi_node_db` |
| PostgreSQL | Stores settled user session history | Prisma model `Session` |

## Request and data flow

### User authentication

1. The browser requests a login challenge for a wallet address.
2. Orchestrator creates a random challenge message and stores it in an Express session.
3. The user signs that message in MetaMask.
4. Orchestrator recovers the signer address, checks it against the challenge address, then issues an `AccessToken` JWT cookie.
5. Authenticated browser routes verify that cookie. The browser sends credentials on API calls.

The challenge is short-lived (five minutes in the current controller). The JWT cookie and the Express session cookie are separate mechanisms with different purposes.

### Connection selection

1. The browser asks MetaMask to approve up to 100 MESH for the configured Ledger contract.
2. The browser posts latitude, longitude, requested bandwidth, and maximum latency to Orchestrator.
3. Orchestrator validates the inputs and asks the Engine for a path.
4. The Engine searches its node graph, selects a suitable path to a gateway, and reduces available bandwidth on the selected nodes.
5. Orchestrator stores connection details in the user's server-side session.

The browser must use the chain and token/ledger addresses to which those contracts were deployed.

### Connection termination and settlement

1. Orchestrator removes the user reservation from the Engine.
2. It looks up node data in MongoDB and sends a settlement payload to Ledger.
3. Ledger calculates the session cost, calls `transferFunds` on the contract, then stores a history row in PostgreSQL.
4. Orchestrator returns the settlement result to the browser.

The Ledger cost formula is `(bandwidthUsed * 7 + durationSeconds * 3) / 10`. On termination, Orchestrator generates the `totalBandwidthUsed` value using a random value.

### Node registration and synchronization

1. `Contracts/scripts/distribute.js` creates mock wallet accounts and registers each node on-chain.
2. The script sends the resulting node records to Orchestrator's pseudo-node registration endpoint.
3. Orchestrator checks each node's on-chain registration, persists eligible nodes in MongoDB, and submits the initial node batch to the Engine.
4. Later add/remove operations update the Orchestrator database, blockchain (for registration), and Engine using separate calls.

## Protocol and storage

The gRPC service is defined in [`packages/proto/mesh.proto`](../packages/proto/mesh.proto). It defines node and user messages plus methods for initial load, path selection, adding/removing nodes, and releasing a user's reserved path.

MongoDB stores node metadata in the `WifiNode` Mongoose model. PostgreSQL stores settled sessions in the Prisma `Session` model.

## Network boundaries

- The browser and MetaMask run on the host. They must use host-published URLs such as `http://localhost:3000` and `http://127.0.0.1:8545`.
- If services are later placed in Docker Compose, container-to-container calls should use Compose service DNS names, not `localhost`.
