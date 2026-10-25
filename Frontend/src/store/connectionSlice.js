import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import connectionService from "../backend/connect.js"

export const terminateConnection = createAsyncThunk(
  "connection/endConnection",
  async (_, { rejectWithValue }) => {

    connectionService.terminateConnection()
    .then(data => {

        return data;
    })
    .catch(error => {
        return rejectWithValue(
        error.message || "Connection termination failed"
      );

    })
  }
);



const initialState = {

    activeStatus: false,
    userHistory: []
    
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
        }

    },
    extraReducers: (builder) => {
    builder
      .addCase(terminateConnection.fulfilled, (state, action) => {
        state.userHistory.push(action.payload)
      })
      .addCase(terminateConnection.rejected, (state, action) => {
        state.userHistory.push({error: action.payload})
      });

    }
})

export const { setActiveStatus, initialiseUserHistory } = connectionSlice.actions;

export default connectionSlice.reducer;