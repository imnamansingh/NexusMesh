import express from "express"
const app = express();

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true , limit: "16kb"}))


import orchestratorRouter from "./routes/orchestrator.routes.js"

app.use("/api/v1/orchestrator", orchestratorRouter);

export default app;