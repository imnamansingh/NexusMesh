# Operations runbook

This runbook covers local Docker Compose and manual startup, shutdown, reset, and troubleshooting workflows for the NexusMesh student project. It is not production deployment guidance.

## Start the Docker Compose stack

From the repository root, prepare the required `.env` files as described in [Local development setup](local-development.md), then run:

```powershell
docker compose up --build --wait -d
docker compose ps -a
```

Compose builds the app images, waits for health checks where configured, and runs the contract deployment/distribution jobs. The jobs should finish with exit code 0; long-running services should report healthy.

## Check services and logs

```powershell
docker compose ps -a
docker compose logs -f orchestrator
docker compose logs --tail=100 contracts-deploy contracts-distribute
docker compose exec -it orchestrator sh
```

Use the Compose service name, not the generated container name, with `exec` and `logs`. `docker compose exec` requires a running service. Ctrl+C exits a shell or stops following logs; it does not stop the whole Compose stack unless used in the foreground `docker compose up` process.

| Component | Compose host endpoint |
|---|---|
| Frontend | `http://127.0.0.1:5173` |
| Orchestrator | `http://127.0.0.1:3000` |
| Hardhat node | `http://127.0.0.1:8545` |
| PostgreSQL | `127.0.0.1:5433` |
| Ledger, Engine, MongoDB | Internal to the Compose network |

Containers connect to one another using Compose service names and container ports, for example `mongodb:27017` and `postgres:5432`.

## Stop and preserve data

```powershell
docker compose down
```

This removes the containers but retains the named `postgres_data` and `mongodb_data` volumes. To remove those volumes and their database data as well:

```powershell
docker compose down -v
```

**Important:** stopping Orchestrator normally invokes its SIGINT/SIGTERM handler, which drops the `WifiNode` collection from `wifi_node_db`. The MongoDB volume remains, but that collection's documents are deleted. This is separate from `docker compose down -v`.

## Manual host-based workflow

For running services directly on the host, follow the manual workflow in [Local development setup](local-development.md). Keep each long-running process in its own terminal and stop it with Ctrl+C. Do not run both workflows against the same ports.

## Reset local blockchain state

Stopping a default Hardhat node resets its local chain state. To rebuild the local contract environment:

1. Start the Hardhat node again. The Compose Hardhat service has no persistent volume, so it starts with a fresh local chain after recreation.
2. Deploy contracts with the `contracts-deploy` Compose job or `npx hardhat run scripts/deploy.js --network localhost` in the manual workflow.
3. Check the addresses printed by the deployment script and synchronize the relevant `.env` values; the current script does not update them automatically.
4. Rebuild the Frontend image if its build-time contract address values change. For manual Vite development, restart Vite after changing `.env` values.
5. Run the node distribution script to register and synchronize mock nodes.
6. Confirm MetaMask is connected to the local RPC and select an account funded by the current node.

## Troubleshooting sequence

1. Check that the relevant process is running and listening on its configured port.
2. Verify each service's environment values, especially API URLs, database URLs, contract addresses, and chain ID.
3. Confirm that browser-origin settings match the Vite URL and that browser requests include credentials where needed.
4. Check service logs for database connection, JSON-RPC, HTTP, or gRPC errors.
5. Confirm mock nodes have been registered and synchronized before requesting a mesh path.
6. For settlement issues, check token balance, allowance, node registration, service signer, chain connectivity, and PostgreSQL connectivity.
