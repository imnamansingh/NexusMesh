import app from "./app.js"
import "dotenv/config";

try {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`server is running on PORT ${process.env.PORT || 5000}`);
    })
} catch (error) {
    console.log(`Error while starting the server: ${error}`);
    process.exit(1);
}