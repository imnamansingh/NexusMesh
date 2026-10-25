const conf = {
    backendURL: String(import.meta.env.VITE_BACKEND_URL),
    connectionTimerLimit: Number(import.meta.env.VITE_CONNECTION_TIMEOUT_LIMIT)
}

export default conf;