# Configuration reference

Configuration can come from Compose environment entries, Compose interpolation, or per-service `.env` files. These mechanisms are not interchangeable:

- The project-root `.env` (beside `docker-compose.yml`) supplies `${NAME}` substitutions while Compose reads its configuration. It does not automatically pass every variable to every container.
- A service's `environment` block explicitly sets variables inside that service's container.
- A bind mount such as `./Orchestrator/.env:/app/.env:ro` makes a host file available inside the container. `ro` means read-only. Node services that import `dotenv/config` load that file at startup. Variables already set by Compose take precedence over values loaded by dotenv.
- Vite `VITE_*` values are compiled into the static frontend bundle at image-build time. Setting them only as runtime container environment variables does not rewrite the bundle.

The `.env` files are ignored by Git. Keep private credentials in server-side environment files; frontend `VITE_*` variables are included in browser-delivered code.

## Docker Compose environment sources

| Service | Values supplied by Compose | Other source |
|---|---|---|
| `postgres` | `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Root `.env` interpolation; password is required |
| `mongodb` | None | Mongo image defaults; data is stored in the `mongodb_data` volume |
| `engine` | None | No runtime environment values are required |
| `hardhat-node` | `HARDHAT_NODE_URL` | Hardhat node is the local chain at chain ID `31337` |
| `contracts-deploy` | `HARDHAT_NODE_URL` | `Contracts/.env` is available through the repository bind mount and loaded by dotenv |
| `contracts-distribute` | `HARDHAT_NODE_URL`, `ORCHESTRATOR_URL` | `Contracts/.env` supplies the deployed Ledger contract address; the script defaults to 1,000 mock nodes because Compose does not override `MOCK_DAEMON_COUNT` |
| `orchestrator` | `PORT`, `MONGODB_CONNECTION_URL`, `HARDHAT_NODE_URL`, `CPP_SERVICE_URL`, `LEDGER_SERVICE_URL`, `CORS_ORIGIN` | `Orchestrator/.env` is mounted read-only at `/app/.env` for secrets and other app settings |
| `ledger` | `PORT`, `DATABASE_URL`, `HARDHAT_NODE_URL` | `Ledger/.env` is mounted read-only at `/app/.env`, including the deployed contract address |
| `frontend` | `VITE_BACKEND_URL`, `VITE_CONNECTION_TIMEOUT_LIMIT` at runtime | The image contains a static Vite build. Compose runtime environment values do not change that bundle; the Dockerfile's `ARG` defaults are used at build time |

The Ledger Compose `DATABASE_URL` connects to `postgres:5432` on the Compose network. The PostgreSQL host mapping is `127.0.0.1:5433:5432`, so host tools use port `5433`; container-to-container connections continue to use `5432`.

The Contracts deployment script currently prints the deployed token and Ledger addresses but does not write them into the service `.env` files. After deploying to a fresh local chain, check the output and keep the addresses used by Contracts, Ledger, Orchestrator, and the Frontend consistent with that chain.

## Frontend

| Variable | Required by current code | Meaning |
|---|---:|---|
| `VITE_BACKEND_URL` | Yes | Browser-reachable base URL for Orchestrator, e.g. `http://localhost:3000` in local development |
| `VITE_CONNECTION_TIMEOUT_LIMIT` | Yes | Connection timer value consumed by frontend configuration |
| `VITE_LEDGER_CONTRACT_ADDRESS` | Yes | Ledger contract address on the chain MetaMask is connected to |
| `VITE_MESH_TOKEN_CONTRACT_ADDRESS` | Yes | MESH token address on that same chain |

Vite embeds `VITE_*` values in browser-delivered code. Treat all of them as public. Contract addresses are public identifiers, not secrets. Never put private keys, seed phrases, server secrets, or privileged provider credentials here.

The Compose Frontend image is built as a static bundle. To change its Vite values, set the corresponding Dockerfile build arguments (or add them under the Frontend service's Compose `build.args`) before building the image; setting the service's runtime `environment` values alone does not rewrite the bundle.

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
| `CONNECTION_TOKEN_SECRET` | Set in the environment | Signing secret for the connection-session token |
| `CONNECTION_TOKEN_EXPIRY` | Set explicitly | Connection-token expiry accepted by `jsonwebtoken` |
| `CONNECTION_TOKEN_COOKIE_MAXAGE` | Parsed as an integer; set explicitly | Connection-token cookie lifetime in milliseconds |
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
| `MOCK_DAEMON_COUNT` | `scripts/distribute.js` | Number of mock nodes to create; defaults to `1000`. The current Compose service does not override this value |

`scripts/deploy.js` currently prints deployed contract addresses to its output; it does not update `.env` files. Run it from the `Contracts` directory, then update the relevant local environment values if the deployed addresses differ. Do not share or commit those environment files.

## Ports in local development and Compose

The container port is not always the same as the host port. Only published ports are reachable from the host; services on the Compose network use service DNS names and container ports.

| Component | Container / local development port | Compose host access |
|---|---:|---|
| Frontend | Container `80`; Vite dev server `5173` | `http://127.0.0.1:5173` |
| Orchestrator HTTP | `3000` | `http://127.0.0.1:3000` |
| Ledger HTTP | `5000` | Internal only; `http://ledger:5000` from containers |
| C++ Engine gRPC | `50051` | Internal only; `engine:50051` from containers |
| Hardhat local JSON-RPC | `8545` | `http://127.0.0.1:8545` |
| MongoDB | `27017` | Internal only; `mongodb:27017` from containers |
| PostgreSQL | Container `5432` | `127.0.0.1:5433` on the host; `postgres:5432` from containers |

These are local-development settings for a student project, not production deployment guidance. Verify actual process configuration and port availability in each environment.
