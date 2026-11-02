# Frontend

## Stack and entry points

The frontend is a Vite-powered React SPA using React Router, Redux Toolkit, React Redux, React Hook Form, and ethers v6.

- `src/main.jsx` mounts the app and Redux store.
- `src/router.jsx` defines home, history, and connection routes.
- `src/backend/auth.js` performs wallet-signature authentication and user lookups.
- `src/backend/connect.js` handles token approval, mesh connection, termination, and history requests.
- `src/conf/index.js` reads Vite environment variables.

## User flow

The browser requests a nonce, asks MetaMask to sign it, then posts the message/signature while preserving cookies. For connection requests it sends form values to Orchestrator and asks the wallet to approve 100 MESH for the configured Ledger contract first.

History and connection pages are route-protected in the UI with `AuthLayout`; server-side route authorization still comes from Orchestrator's JWT verification.

## Configuration and development

See [configuration](../configuration.md#frontend) for `VITE_*` variables. These values become visible to browser users. Run `npm ci`, `npm run dev`, `npm run lint`, and `npm run build` from `Frontend`.

The browser uses `VITE_BACKEND_URL` and MetaMask's selected provider. Do not use a Docker-internal hostname for a URL that the browser must resolve.

## Operational notes

- The frontend expects the configured token and Ledger addresses to match the currently selected wallet network.
- The frontend sends an approval for a fixed 100 MESH per connection attempt.
