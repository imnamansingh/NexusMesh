import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";

const app = express();

//for cross origin resource sharing (to be specific, for frontend calls from the browser to orchestrator)
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// to parse json data fron json.string to an object and inject that data into req.body (otherwise req.body will be undefined and you have to manually parse the incoming req data)
app.use(express.json());

//same as express.json but used for data submitted through HTML forms or data coming via the URL becuase their content type is different from application/json, their content type is application/x-www-form-urlencoded. "extended: true" option is used for nested objects. 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,

    //do not save same session in again in any future request
    resave: false,

    // do not save empty sessions
    saveUninitialized: false,

    cookie: {

        // to prevent the frontend js from reading the cookie using document.cookie for security reasons.
        httpOnly: true,

        // cookie will be set only on HTTPS requests not HTTP requests
        secure: false,

        // option for configuring sending of cookies over cross-site requests
        sameSite: "lax",

        maxAge: parseInt(process.env.SESSION_COOKIE_MAXAGE)
    }
}))

import cppServiceRoute from "./routes/c++_service.routes.js"
import userRoute from "./routes/user.routes.js"
import pseudoNodeRoute from "./routes/pseudo_node.routes.js"

app.use("/api/v1/cpp_service", cppServiceRoute);
app.use("/api/v1/frontend", userRoute);
app.use("/api/v1/pseudo_node", pseudoNodeRoute);


//Global Express error-handling middleware
app.use((error, req, res, next) => {

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: error.message || "Internal server error",
        errors: error.errors || []
    })

});

export default app;