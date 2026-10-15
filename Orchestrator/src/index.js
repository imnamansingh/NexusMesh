import "dotenv/config"
import app from "./app.js"
import { connectDB, disconnectDB } from "./db/index.js";

const PORT = process.env.PORT || 3000;

let server;
let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`${signal} received; shutting down`);

  try {
    
    if (server?.listening) {

      //await only works with promises ie thenables
      //await do not work with callbacks because it doesnt wait for callback functions. As soon as it get a value from the function it passes the execution flow and it doesnt wait for callback to get fired but it waits for the promise.
      await new Promise((resolve, reject) => {
        //server.close() is an HTTP server method from Node.js. It tells the server to stop accepting new connections, let existing connections finish/close and then invoke the callback when shutdown is complete.
        server.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }
    //promise executor function runs synchronously anyway, with or without the await, but if theres some async work inside executor fn and you need to wait for it before going to next line you must use await before a promise.

    //.then and .catch work on settled promises.
    
    await disconnectDB();
    console.log("Shutdown completed");
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exitCode = 1;
  }
}

//process.once() registers a listener that runs only the first time a specific event is emitted.
process.once("SIGINT", () => {
  void shutdown("SIGINT");
});

process.once("SIGTERM", () => {
  void shutdown("SIGTERM");
});

connectDB()
.then(() => {
    //app.listen immediately returns a server object. Then Node may later emit an "error" event if binding fails.
    server = app.listen(PORT, () => {
        console.log(`server is running on port ${process.env.PORT || 3000}`);
    })
    //server.on listens for error thrown by http server instance while running and the catch block below is not responsible for these errors because they are asynchronous errors.
    server.on("error", (error) => {
        console.log("server error: ", error);
        process.exitCode = 1;
        void shutdown("SIGINT");
    })
})
//the catch block only catches promise rejection or synchronous errors within the .then block but it doesnt wait for asynchronous errors.
.catch((error) => {
    console.log(`error: ${error}`);
    process.exitCode = 1;
    void shutdown("SIGINT");
})

