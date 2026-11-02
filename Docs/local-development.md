# Local development

Run Git Bash commands from the repository root unless a step names a service directory. Use a separate terminal for each long-running service. Commands are shown for Git Bash unless a step is explicitly labeled PowerShell. Native C++ build commands and toolchain paths vary by platform.

## Prerequisites

- Node.js and npm compatible with the lockfiles and package versions.
- MongoDB for Orchestrator node records.
- PostgreSQL for Ledger session history.
- MetaMask for browser wallet interactions.
- Hardhat local EVM node for local contract deployment and testing.
- CMake, a C++20 compiler, vcpkg with `grpc` and `protobuf`, and Protocol Buffers/gRPC code-generation tools for Engine.
- Generated protobuf/gRPC source files for both the C++ Engine and the Node.js Orchestrator.

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

## Start the services

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

   The deploy script writes the contract addresses into the service `.env` files. It expects those files to exist. Restart Vite after changing its environment, because Vite reads its configuration at startup.

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
