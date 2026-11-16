import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import connectionService from "../backend/connect.js"

export const terminateConnection = createAsyncThunk(
  "connection/endConnection",
  async (_, { rejectWithValue }) => {

    try {

        return await connectionService.terminateConnection()

    } catch (error) {
        return rejectWithValue(
            error.message || "Connection termination failed"
        );
    }
  }
);

const initialState = {

    activeStatus: false,
    userHistory: [],
    transitionStatus: false,
    connectionMap: []

}

const connectionSlice = createSlice({
    name: "connection",
    initialState,
    reducers: {
        setActiveStatus: (state, action) => {
            state.activeStatus = action.payload;
        },
        initialiseUserHistory: (state, action) => {
            state.userHistory = action.payload
        },
        populateConnectionMap: (state, action) => {
          state.connectionMap = action.payload
        }

    },
    extraReducers: (builder) => {
    builder
      .addCase(terminateConnection.pending, (state) => {
        state.transitionStatus = true
      })
      .addCase(terminateConnection.fulfilled, (state, action) => {
        state.userHistory.push(action.payload)
        state.transitionStatus = false
        state.activeStatus = false
      })
      .addCase(terminateConnection.rejected, (state, action) => {
        state.userHistory.push({error: action.payload})
        state.transitionStatus = false
        state.activeStatus = false
      });

    }
})

export const { setActiveStatus, initialiseUserHistory, populateConnectionMap } = connectionSlice.actions;

export default connectionSlice.reducer;

