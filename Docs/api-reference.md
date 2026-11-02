# HTTP API reference

Base paths are mounted by the Express applications. The Orchestrator uses JSON responses and cookie credentials for browser authentication. Exact error strings may change with implementation.

## Orchestrator: frontend routes

Base path: `/api/v1/frontend`

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/get_nonce?walletAddress=0x…` | No | Create a short-lived sign-in challenge stored in the Express session |
| POST | `/login` | Challenge session | Verify the signed challenge and set the `AccessToken` cookie |
| GET | `/get_user` | JWT cookie | Return the authenticated wallet address |
| GET | `/logout` | JWT cookie | Clear the access-token cookie |
| POST | `/get_connection` | JWT cookie | Request a route through the mesh |
| GET | `/end_connection` | JWT cookie and connection session | Release the path and request settlement |
| GET | `/get_session_history` | JWT cookie | Fetch session history from Ledger |

### Login request

`POST /login`

```json
{
  "message": "the exact challenge message returned by /get_nonce",
  "signature": "0x..."
}
```

The browser must preserve cookies between the nonce request and login, and include credentials for authenticated calls. The challenge expires after five minutes in the current implementation.

### Connection request

`POST /get_connection`

```json
{
  "lat": 28.6139,
  "lon": 77.209,
  "required_bandwidth": 10,
  "max_latency": 25
}
```

Current validation accepts latitude `[-90, 90]`, longitude `[-180, 180]`, positive bandwidth up to `300`, and integer maximum latency from `0` to `50`. The response contains the selected Engine path; connection state is associated with the server session.

### History response

The endpoint wraps the Ledger session list in the standard Orchestrator response envelope:

```json
{
  "statusCode": 200,
  "message": "History fetched successfully",
  "data": {
    "history": []
  },
  "success": true
}
```

## Orchestrator: pseudo-node routes

Base path: `/api/v1/pseudo_node`

| Method | Path | Body | Purpose |
|---|---|---|---|
| POST | `/register` | Array of node records | Verify node registration on-chain, persist eligible nodes, and initialize Engine state |
| POST | `/add_node` | Single-element array containing a node record | Verify and persist a node, then add it to Engine |
| POST | `/remove_node` | `{ "nodeId": 123 }` | Remove a node from Engine and MongoDB |

Node records currently include `id`, `walletAddress`, `ipAddress`, `latitude`, `longitude`, `maxBandwidth`, `maxLatency`, `isGateway`, and `registeredAt`.

## Ledger service

Base path: `/api/v1/orchestrator`

| Method | Path | Purpose |
|---|---|---|
| POST | `/settle_session` | Calculate cost, call the Ledger contract, then persist session history |
| GET | `/get_history?userWalletAddress=0x…` | Return matching session records |

Settlement currently accepts `sessionStartTime`, `sessionEndTime`, `totalBandwidthUsed`, user/node coordinates, and user/node wallet addresses.

## gRPC: Engine

Service definition: [`packages/proto/mesh.proto`](../packages/proto/mesh.proto). The Orchestrator connects to the `MeshService` methods:

| RPC | Purpose |
|---|---|
| `InitialReboot(NodeBatch)` | Replace/initialize node graph and adjacency |
| `GetShortestPath(User)` | Find a feasible route to a gateway |
| `AddNodeMethod(AddNode)` | Add a node and return neighboring node IDs |
| `RemoveNodeMethod(RemoveNode)` | Remove a node |
| `RemoveUserMethod(RemoveUser)` | Release bandwidth reservation across a path |

Each response contains a `Status` and `status_message`; path selection additionally returns `path_list`, `gateway_id`, and `no_of_hops`.
