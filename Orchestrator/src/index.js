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

      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }
    await disconnectDB();
    console.log("Shutdown completed");
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exitCode = 1;
  }
}

process.once("SIGINT", () => {
  void shutdown("SIGINT");
});

process.once("SIGTERM", () => {
  void shutdown("SIGTERM");
});

connectDB()
.then(() => {
    server = app.listen(PORT, () => {
        console.log(`server is running on port ${process.env.PORT || 3000}`);
    })
    server.on("error", (error) => {
        console.log("server error: ", error);
        process.exitCode = 1;
        void shutdown("SIGINT");
    })
})
.catch((error) => {
    console.log(`error: ${error}`);
    process.exitCode = 1;
    void shutdown("SIGINT");
})

