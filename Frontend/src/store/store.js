import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit"
import authSlice from "./authSlice.js"
import connectionSlice, { setActiveStatus } from "./connectionSlice.js"
import conf from "../conf/index.js"

const connectionTimer = createListenerMiddleware();

connectionTimer.startListening({
  actionCreator: setActiveStatus,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();

    if (!action.payload) {
      return;
    }

    //check if user manually terminated the connection
    await listenerApi.delay(conf.connectionTimerLimit);
    listenerApi.dispatch(setActiveStatus(false));
  },
});

const store = configureStore({
    reducer: {
        auth: authSlice,
        connection: connectionSlice
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(connectionTimer.middleware)
});

export default store;