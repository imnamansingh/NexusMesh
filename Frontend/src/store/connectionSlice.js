import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    activeStatus: false,
    
}

const connectionSlice = createSlice({
    name: connection,
    initialState,
    reducers: {
        startConnection: (state) => {
            state.activeStatus = true;
        }

    }
})

export const { startConnection} = connectionSlice.actions;

export default connectionSlice.reducer;