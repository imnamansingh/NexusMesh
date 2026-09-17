import "dotenv/config"
import app from "./app.js"
import connectDB from "./db/index.js";

connectDB()
.then(() => {
    const server = app.listen(process.env.PORT || 3000, () => {
        console.log(`server is running on port ${process.env.PORT || 3000}`);
    })
    server.on("error", (error) => {
        console.log("server error: ", error);
        //we should avoid throwing error inside the server error event so let the process exit with code 1.
        process.exit(1);
    })
})
.catch((error) => {
    console.log(`error: ${error}`);
    process.exit(1);
})

