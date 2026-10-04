import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    getNonce,
    authenticateUser,
    getSessionHistory,
    logoutUser,
    getConnection,
    terminateConnection
} from "../controllers/user.controllers.js"

const router = Router();

router.route("/get_nonce").get(getNonce)
router.route("/login").post(authenticateUser)
router.route("/get_session_history").get(verifyJWT, getSessionHistory)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/get_connection").post(verifyJWT, getConnection)
router.route("/end_connection").post(verifyJWT, terminateConnection)

export default router;