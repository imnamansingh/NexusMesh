import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./authSlice.js"
import connectionSlice from "./connectionSlice.js"

const store = configureStore({
    reducer: {
        auth: authSlice,
        connection: connectionSlice
    }
});

export default store;