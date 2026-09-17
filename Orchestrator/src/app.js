import express from "express"


const app = express();

// to parse json data fron json.string to an object and inject that data into req.body (otherwise req.body will be undefined and you have to manually parse the incoming req data)
app.use(express.json());

//same as express.json but used for data submitted through HTML forms becuase their content type is different from application/json, their content type is application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

import cppServiceRoute from "./routes/c++_service.routes.js"
import frontendRoute from "./routes/frontend.routes.js"
import pseudoNodeRoute from "./routes/pseudo_node.routes.js"

app.use("/api/v1/cpp_service", cppServiceRoute)
app.use("/api/v1/frontend", frontendRoute)
app.use("/api/v1/pseudo_node", pseudoNodeRoute)

export default app;