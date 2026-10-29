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


