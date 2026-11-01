const conf = {
    backendURL: String(import.meta.env.VITE_BACKEND_URL),
    connectionTimerLimit: Number(import.meta.env.VITE_CONNECTION_TIMEOUT_LIMIT),
    ledgerAddress: String(import.meta.env.VITE_LEDGER_CONTRACT_ADDRESS),
    tokenAddress: String(import.meta.env.VITE_MESH_TOKEN_CONTRACT_ADDRESS),
    functionABI: ["function approve(address spender, uint256 value) returns (bool)"]
}

export default conf;