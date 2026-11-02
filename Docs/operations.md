# Operations runbook

This runbook covers routine local startup, shutdown, reset, and troubleshooting workflows for the NexusMesh services.

## Start the local stack

Follow [Local development setup](local-development.md) to start the databases, Hardhat node, contracts, Engine, Orchestrator, Ledger, and Frontend. Keep each foreground process running in its own terminal.

## Check service availability

| Component | Local endpoint or check |
|---|---|
| Frontend | Open the Vite URL printed by `npm run dev`, typically `http://localhost:5173` |
| Orchestrator | `http://localhost:3000` |
| Ledger | `http://localhost:5000` |
| Engine | gRPC at `localhost:50051` |
| Hardhat node | JSON-RPC at `http://127.0.0.1:8545` |
| MongoDB | Confirm the configured MongoDB instance accepts connections |
| PostgreSQL | Confirm the `DATABASE_URL` host/database is reachable and Prisma can query it |

The HTTP services expose their application routes under the documented API prefixes. The Engine is checked using a gRPC client or through an Orchestrator operation that calls it.

## Stop services

Stop foreground development processes with Ctrl+C in their respective terminals. For database services managed by the operating system, use the database's normal service-management tools.

## Reset local blockchain state

Stopping a default Hardhat node resets its local chain state. To rebuild the local contract environment:

1. Start the Hardhat node again.
2. Deploy contracts with `npx hardhat run scripts/deploy.js --network localhost`.
3. Confirm the updated addresses are in the local service environment files.
4. Restart Vite after frontend `.env` values change.
5. Run the node distribution script to register and synchronize mock nodes.
6. Confirm MetaMask is connected to the local RPC and select an account funded by the current node.

## Troubleshooting sequence

1. Check that the relevant process is running and listening on its configured port.
2. Verify each service's environment values, especially API URLs, database URLs, contract addresses, and chain ID.
3. Confirm that browser-origin settings match the Vite URL and that browser requests include credentials where needed.
4. Check service logs for database connection, JSON-RPC, HTTP, or gRPC errors.
5. Confirm mock nodes have been registered and synchronized before requesting a mesh path.
6. For settlement issues, check token balance, allowance, node registration, service signer, chain connectivity, and PostgreSQL connectivity.
