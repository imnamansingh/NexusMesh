import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "1mb" }));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {

        httpOnly: true,

        secure: false,

        sameSite: "lax",

        maxAge: parseInt(process.env.SESSION_COOKIE_MAXAGE)
    }
}))
import userRoute from "./routes/user.routes.js"
import pseudoNodeRoute from "./routes/pseudo_node.routes.js"

app.use("/api/v1/frontend", userRoute);
app.use("/api/v1/pseudo_node", pseudoNodeRoute);


//Global Express error-handling middleware
app.use((error, req, res, next) => {
    console.log(error.message)

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: error.message || "Internal server error",
        errors: error.errors || []
    })

});

export default app;