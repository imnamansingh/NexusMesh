# Ledger service

## Responsibility

Ledger is a Node.js/Express service that settles completed sessions through the NexusMesh Ledger smart contract and stores session history in PostgreSQL through Prisma.

## Interfaces

- Default HTTP port: `5000`
- Base path: `/api/v1/orchestrator`
- Routes: `POST /settle_session`, `GET /get_history`

See the [HTTP API reference](../api-reference.md#ledger-service).

## Settlement behavior

For a settlement request the service:

1. Computes duration in seconds from start/end timestamps.
2. Calculates cost as `(totalBandwidthUsed * 7 + totalSessionTime * 3) / 10`.
3. Converts MESH to 18-decimal base units.
4. Calls `transferFunds(user, node, cost)` and waits for the transaction.
5. Stores the session as a `Session` row in PostgreSQL.

The service calls the contract before inserting the session history row.

## Persistence

The Prisma schema is `prisma/schema.prisma`. `Session` contains start/end time, duration, cost, bandwidth, user/node coordinates, user/node wallet addresses, and creation time. `DATABASE_URL` is configured through Prisma.

Typical local schema setup:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Run commands from the `Ledger` directory and use an existing migration where appropriate.

## Development and configuration

Install with `npm ci`; start using `npm run start`. Configure `DATABASE_URL`, `HARDHAT_NODE_URL`, and `LEDGER_CONTRACT_ADDRESS` as described in [configuration](../configuration.md#ledger-service).

The transaction signer is obtained with `provider.getSigner(0)` from the configured JSON-RPC provider.
