# Configuration reference

Configuration is loaded from per-service `.env` files for local development. Those files are ignored by Git. Keep private credentials in server-side environment files; frontend `VITE_*` variables are included in browser-delivered code.

## Frontend

| Variable | Required by current code | Meaning |
|---|---:|---|
| `VITE_BACKEND_URL` | Yes | Browser-reachable base URL for Orchestrator, e.g. `http://localhost:3000` in local development |
| `VITE_CONNECTION_TIMEOUT_LIMIT` | Yes | Connection timer value consumed by frontend configuration |
| `VITE_LEDGER_CONTRACT_ADDRESS` | Yes | Ledger contract address on the chain MetaMask is connected to |
| `VITE_MESH_TOKEN_CONTRACT_ADDRESS` | Yes | MESH token address on that same chain |

Vite embeds `VITE_*` values in browser-delivered code. Treat all of them as public. Contract addresses are public identifiers, not secrets. Never put private keys, seed phrases, server secrets, or privileged provider credentials here.

## Orchestrator

| Variable | Default/behavior | Meaning |
|---|---|---|
| `PORT` | `3000` | HTTP listen port |
| `CORS_ORIGIN` | Set in the environment | Exact browser origin allowed by CORS |
| `SESSION_SECRET` | Set in the environment | Express session signing secret |
| `SESSION_COOKIE_MAXAGE` | Parsed as an integer; set explicitly | Express session cookie lifetime in milliseconds |
| `ACCESS_TOKEN_SECRET` | Set in the environment | JWT signing and verification secret |
| `ACCESS_TOKEN_EXPIRY` | Set explicitly | JWT expiry accepted by `jsonwebtoken` |
| `ACCESS_TOKEN_COOKIE_MAXAGE` | Parsed as an integer; set explicitly | JWT cookie lifetime in milliseconds |
| `MONGODB_CONNECTION_URL` | Set in the environment | MongoDB base connection URL; code appends `/wifi_node_db` |
| `HARDHAT_NODE_URL` | `http://localhost:8545` | JSON-RPC endpoint used to query node registrations |
| `LEDGER_CONTRACT_ADDRESS` | Set in the environment | Deployed Ledger contract address |
| `LEDGER_SERVICE_URL` | `http://localhost:5000` | Ledger HTTP service base URL |
| `CPP_SERVICE_URL` | `http://localhost:50051` | Engine gRPC base URL |

For example, a local MongoDB base URL is typically `mongodb://localhost:27017`. The database name is appended by the application.

## Ledger service

| Variable | Default/behavior | Meaning |
|---|---|---|
| `PORT` | `5000` | HTTP listen port |
| `DATABASE_URL` | Required by Prisma | PostgreSQL connection URL |
| `HARDHAT_NODE_URL` | `http://localhost:8545` | JSON-RPC URL used for contract transactions |
| `LEDGER_CONTRACT_ADDRESS` | No default | Deployed Ledger contract address |

The Ledger service uses `provider.getSigner(0)` for settlement.

## Contracts tooling

| Variable | Used by | Meaning |
|---|---|---|
| `LEDGER_CONTRACT_ADDRESS` | `scripts/distribute.js` | Address of the deployed Ledger contract |
| `ORCHESTRATOR_URL` | `scripts/distribute.js` | Full pseudo-node registration URL; defaults to `http://localhost:3000/api/v1/pseudo_node/register` |
| `MOCK_DAEMON_COUNT` | `scripts/distribute.js` | Number of mock nodes to create; defaults to `1000` |

`scripts/deploy.js` writes deployed contract addresses into existing `.env` files under Contracts, Ledger, Orchestrator, and Frontend. Run it from the `Contracts` directory. Do not share or commit those environment files.

## Ports in the current code

| Component | Default port |
|---|---:|
| Vite frontend | `5173` |
| Orchestrator HTTP | `3000` |
| Ledger HTTP | `5000` |
| C++ Engine gRPC | `50051` |
| Hardhat local JSON-RPC | `8545` |
| MongoDB | `27017` (default MongoDB port) |
| PostgreSQL | `5432` (default PostgreSQL port) |

Defaults describe local development conventions; verify actual process configuration and port availability in each environment.
