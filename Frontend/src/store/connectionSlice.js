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
    userHistory: [
      {
        error: "dummy error"
      },
      {
        sessionId: "a1b2c3d4-e5f6-4789-a012-3456789abcde",
        sessionStartTime: "2026-10-28T09:00:00.000Z",
        sessionEndTime: "2026-10-28T09:15:00.000Z",
        totalSessionTime: 900,
        totalCost: 12.5,
        totalBandwidthUsed: 150,
        userLat: 40.7128,
        userLon: -74.006,
        nodeLat: 40.7306,
        nodeLon: -73.9352,
        userWalletAddress: "0x1111111111111111111111111111111111111111",
        nodeWalletAddress: "0x2222222222222222222222222222222222222222",
        createdAt: "2026-10-28T09:15:02.000Z",
      },
      {
        sessionId: "b2c3d4e5-f6a7-4890-b123-456789abcdef",
        sessionStartTime: "2026-10-27T14:30:00.000Z",
        sessionEndTime: "2026-10-27T14:42:30.000Z",
        totalSessionTime: 750,
        totalCost: 8.75,
        totalBandwidthUsed: 95,
        userLat: 34.0522,
        userLon: -118.2437,
        nodeLat: 34.0612,
        nodeLon: -118.3081,
        userWalletAddress: "0x1111111111111111111111111111111111111111",
        nodeWalletAddress: "0x3333333333333333333333333333333333333333",
        createdAt: "2026-10-27T14:42:32.000Z",
      },
      {
        sessionId: "c3d4e5f6-a7b8-4901-c234-56789abcdef0",
        sessionStartTime: "2026-10-26T18:00:00.000Z",
        sessionEndTime: "2026-10-26T18:20:00.000Z",
        totalSessionTime: 1200,
        totalCost: 16.25,
        totalBandwidthUsed: 210,
        userLat: 51.5072,
        userLon: -0.1276,
        nodeLat: 51.5155,
        nodeLon: -0.0922,
        userWalletAddress: "0x1111111111111111111111111111111111111111",
        nodeWalletAddress: "0x4444444444444444444444444444444444444444",
        createdAt: "2026-10-26T18:20:03.000Z",
      },
      {
        error: "dummy error"
      }
    ],
    //this state in here is to show loading state while a session is being settled.
    transitionStatus: false
    
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
    //extraReducers handles actions created outside the slice’s reducers block. For example, createAsyncThunks and reducers from different slices.
    extraReducers: (builder) => {
    builder
        //createAsyncThunk automatically creates three different actions for each lifecycle state and you can consider them as three different actions ie reducer.
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

export const { setActiveStatus, initialiseUserHistory } = connectionSlice.actions;

export default connectionSlice.reducer;

//the difference between redux reducer and redux action is quite significant. The reducer that you difine inside slice, it is used to generate an action creater fn with the same name and this is the function that you call via dispatcher to create action (action is just an object). For e.g.
//dispatch(setActiveStatus(true)) creates an action object which looks like
//{ type: "connection/setActiveStatus", payload: true }

//createAsyncThunk doesn’t require its payload creator to return a Promise. It always dispatches pending first, then decides the outcome from what the payload creator returns or throws.

//export const getConstant = createAsyncThunk(
  //"example/getConstant",
  //() => 42 // ordinary synchronous return value
//);

//When you dispatch getConstant():

//Redux Toolkit dispatches getConstant.pending.
//The payload creator returns 42.
//Redux Toolkit dispatches getConstant.fulfilled with action.payload === 42.

//So the three actions represent the thunk’s lifecycle, not necessarily the state of a Promise. A synchronous payload creator simply goes from pending to fulfilled with its returned value.

//these actions are kind of similar to normal actions when seen alone like:
//{ type: "connection/setActiveStatus", payload: true }
//{ type: "connection/getConstant.pending", payload: 42 }
//they are quite similar


