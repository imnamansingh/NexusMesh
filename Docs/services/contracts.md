# Smart contracts and local chain

## Contracts

### `MeshToken`

An OpenZeppelin ERC-20 named `NexusMesh` with symbol `MESH` and standard 18 decimals. The constructor mints the configured initial whole-token supply to the deployer. `scripts/deploy.js` currently passes `10000`. The owner-only `mint` function can mint additional whole tokens.

### `NexusMeshLedger`

Stores a reference to the MESH token and a `ledgerService` address. A node registers its own wallet and IP address with `registerNode`. The configured Ledger service may call `transferFunds`, which requires the destination node to be registered and transfers approved MESH from the user to the node. The owner can update the Ledger service address.

## Deployment

Hardhat configures a `localhost` network at `http://localhost:8545`, chain ID `31337`, and Solidity `0.8.20`.

The Compose stack uses a `hardhat-node` service and one-shot `contracts-deploy` and `contracts-distribute` jobs. The Hardhat node publishes port `8545` on loopback. The node has no persistent volume, so removing/recreating it resets local chain state.

The current deployment script prints the token and Ledger addresses but does not write them into `.env` files. Keep addresses used by Contracts, Ledger, Orchestrator, and the Frontend synchronized with the current local chain.

From `Contracts`:

```bash
npm ci
npx hardhat node
```

In another terminal:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

The deployment script deploys MESH and then the Ledger contract, passing the deployer as Ledger service. It prints the deployed addresses but does not currently write them into `.env` files. Check the output and manually synchronize any service configuration that uses those addresses.

## Mock node distribution

`scripts/distribute.js` creates random node wallets, funds each with `0.05` native ETH from the deployer, registers each wallet on-chain, and sends generated node metadata to the Orchestrator pseudo-node registration endpoint. `MOCK_DAEMON_COUNT` controls the count and defaults to `1000`.

This script generates mock node data with sample locations around New Delhi and synthetic IP, bandwidth, latency, and gateway values. The Compose file does not override `MOCK_DAEMON_COUNT`, so the job uses the script default of 1,000 nodes. To run fewer nodes for a local test, pass an override after starting its dependencies, for example `docker compose run --rm --no-deps -e MOCK_DAEMON_COUNT=5 contracts-distribute`.

## Wallet and network behavior

Contract addresses are public, but they are chain-specific. Configure MetaMask with the local RPC URL and chain ID and import a funded Hardhat account. The private key identifies the account; the selected network determines the RPC connection.

Stopping a default Hardhat node resets its local chain state. Redeploy after a reset, and use the addresses emitted by that deployment. Repeated deployments can appear at the same address only if the network/account nonce state matches; address equality does not preserve old balances, approvals, or contract state.

Hardhat's printed accounts are intended for local testing.

## Security notes

The user must approve the Ledger contract to spend MESH. The current frontend requests an allowance of 100 MESH. The Ledger contract's settlement call uses `transferFrom`, and settlement will revert if the user lacks token balance or allowance.
