# Local development

The repository includes a Docker Compose workflow for the integrated local stack and a separate manual workflow for running services on the host. Compose commands below are shown for PowerShell from the repository root. Native C++ build commands and toolchain paths vary by platform.

## Prerequisites

- Docker Desktop with Docker Compose v2 for the containerized workflow.
- For the manual host-based workflow: Node.js/npm, MongoDB, PostgreSQL, MetaMask, a Hardhat local EVM node, CMake, a C++20 compiler, vcpkg with `grpc` and `protobuf`, and Protocol Buffers/gRPC code-generation tools.

## Run the integrated stack with Docker Compose

1. From the repository root, create the root `.env` file and set at least `POSTGRES_PASSWORD`. `POSTGRES_USER` and `POSTGRES_DB` can be overridden there. Compose uses this file for `${...}` substitutions; it does not automatically pass every root `.env` variable into every container. The Frontend's Vite settings are embedded at image-build time, so changing a runtime Compose value alone does not update the built page.
2. Create the required service `.env` files before starting the stack. Compose mounts `Orchestrator/.env` and `Ledger/.env` read-only inside those containers; the contract scripts read `Contracts/.env` from the repository bind mount. Keep required contract addresses in sync with the current Hardhat chain. The deployment script prints addresses but does not update these files automatically.
3. Build and start the stack from the repository root:

   ```powershell
   docker compose up --build --wait -d
   docker compose ps -a
   ```

   Long-running services should report healthy. `contracts-deploy` and `contracts-distribute` are one-shot jobs and should eventually show `Exited (0)`. `--wait` waits for long-running services to become healthy; check the one-shot job status separately.
4. `contracts-distribute` defaults to 1,000 mock wallets because the current Compose file does not set `MOCK_DAEMON_COUNT`. It funds and registers those wallets, then posts their records to the Orchestrator, which initializes the Engine quadtree. Each node creates local Hardhat transactions, so this setup step can take a while. To use fewer nodes on initial Compose startup, add `MOCK_DAEMON_COUNT` to that service's `environment` in `docker-compose.yml`. To run a smaller batch after the required services are ready, use `docker compose run --rm --no-deps -e MOCK_DAEMON_COUNT=5 contracts-distribute`.
5. The frontend is available at `http://127.0.0.1:5173`; MetaMask connects from the host to `http://127.0.0.1:8545` using chain ID `31337`. Host PostgreSQL clients use `127.0.0.1:5433`. Containers use Compose service names and container ports (for example `postgres:5432`, not `localhost:5433`).

Useful checks:

```powershell
docker compose ps -a
docker compose logs --tail=100 contracts-deploy contracts-distribute
docker compose logs -f orchestrator engine ledger
docker compose exec mongodb mongosh wifi_node_db
docker compose exec -it orchestrator sh
```

Press Ctrl+C to stop following logs; this does not stop the containers. `docker compose down` stops the stack and keeps the named PostgreSQL and MongoDB volumes. `docker compose down -v` also deletes those volumes and their data. The Hardhat node has no persistent volume, so recreating it resets the local chain; redeploy contracts and synchronize mock nodes after a chain reset.

**Orchestrator shutdown behavior:** its current SIGINT/SIGTERM handler drops the `WifiNode` collection in MongoDB before disconnecting. Therefore `docker compose down` or stopping Orchestrator clears that collection even though the `mongodb_data` volume itself is retained. The next distribution job can repopulate node records.

The `Orchestrator/.env` and `Ledger/.env` volume entries ending in `:ro` are read-only bind mounts: the host files appear at `/app/.env` inside their containers. Their Node.js entry points load these files with dotenv. Compose `environment` entries set explicit container variables and take precedence over dotenv values with the same names. The Frontend is built into static files served by Nginx; runtime environment entries do not change the Vite values already embedded in that image.

## Manual local development

The following workflow runs services directly on the host instead of in containers. Do not run both workflows against the same ports unless you have changed the port mappings.

## Initial setup

1. Install npm dependencies separately in `Contracts`, `Orchestrator`, `Ledger`, and `Frontend`:

   ```bash
   (cd Contracts && npm ci)
   (cd Orchestrator && npm ci)
   (cd Ledger && npm ci)
   (cd Frontend && npm ci)
   ```

2. Create local `.env` files for the services using [the configuration reference](configuration.md). Supply local-only values and keep real secrets out of Git.
3. Ensure MongoDB and PostgreSQL are running. Configure the Orchestrator Mongo URL and Ledger `DATABASE_URL`.
4. Generate the protobuf/gRPC outputs from `packages/proto/mesh.proto` for both consumers:
   - C++ outputs under `Engine/generated` (`mesh.pb.*` and `mesh.grpc.pb.*`).
   - JavaScript outputs under `Orchestrator/src/generated` (`mesh_pb.js` and `mesh_connect.js`).
   
   Use `protoc`, the gRPC C++ plugin, and the JS/Connect generators compatible with the checked-in schema and installed dependencies. Keep generated output in sync with the proto file.
5. Generate Prisma client code and apply the initial local schema migration from `Ledger`:

   ```bash
   cd Ledger
   npx prisma generate
   npx prisma migrate dev --name init
   ```

   Use an existing migration instead of `--name init` if migrations have already been created for your checkout.

## Start the services manually

Run each long-lived process in its own terminal and keep it running:

1. **Hardhat node**:

   ```bash
   cd Contracts
   npx hardhat node
   ```

2. **Deploy contracts** in another terminal:

   ```bash
   cd Contracts
   npx hardhat run scripts/deploy.js --network localhost
   ```

   The deploy script prints contract addresses but does not write them into the service `.env` files. Check its output and synchronize the relevant addresses manually. Restart Vite after changing its environment, because Vite reads its configuration at startup.

3. **Build and start Engine**. From `Engine`, configure and build using the local CMake/vcpkg toolchain, then run `EngineService`:

   ```powershell
   # Run these CMake commands in PowerShell, as in the Engine build notes.
   cmake -S . -B build -DCMAKE_TOOLCHAIN_FILE="<path-to-vcpkg>/scripts/buildsystems/vcpkg.cmake"
   cmake --build build --config Release --parallel
   ```

   From a Git Bash terminal opened in `Engine`, run the executable (for example `./build/Release/EngineService.exe` for a Visual Studio generator).

4. **Orchestrator**:

   ```bash
   cd Orchestrator
   npm start
   ```

5. **Ledger**:

   ```bash
   cd Ledger
   npm start
   ```

6. **Frontend**:

   ```bash
   cd Frontend
   npm run dev
   ```

   Open the Vite URL printed in the terminal, typically `http://localhost:5173`.

7. **Create and synchronize mock nodes** only after Hardhat, Engine, Orchestrator, and MongoDB are available:

   ```bash
   cd Contracts
   MOCK_DAEMON_COUNT=5 npx hardhat run scripts/distribute.js --network localhost
   ```

   The script defaults to 1,000 sequential mock wallet deployments/registrations. Start with a small count. It funds generated node wallets with local ETH, registers them on-chain, then posts them to Orchestrator.

## Connect MetaMask to the local chain

Configure a custom network in MetaMask:

- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337` (verify the running Hardhat node configuration)
- Currency symbol: `ETH`
- Block explorer: leave blank for a local chain

Import a Hardhat account for local testing and keep it connected to the local Hardhat chain. The frontend's configured token and Ledger addresses must correspond to this same chain.

## Stop and reset

Stop each foreground process with Ctrl+C. A default Hardhat node resets its local chain state when stopped. Redeploy and rerun mock-node synchronization after a reset.

## Quick troubleshooting

- **MetaMask transaction fails:** check local Hardhat is running, the wallet is on chain ID `31337`, and the contract address belongs to the current node state.
- **Frontend cannot reach API:** check `VITE_BACKEND_URL`, Orchestrator port, and `CORS_ORIGIN`; Vite must be restarted after `.env` changes.
- **Orchestrator cannot connect to Engine:** check Engine is listening on `50051` and `CPP_SERVICE_URL` points to the correct endpoint.
- **Prisma cannot connect:** check PostgreSQL is running and `DATABASE_URL` names the correct database and credentials.
- **Generated module/header missing:** generate protobuf outputs for both Orchestrator and Engine; generated files are not tracked.
- **No mesh path found:** ensure mock nodes were registered and synchronized and the request fits node bandwidth, latency, and geographic range.
