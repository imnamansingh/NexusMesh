import {Router} from "express";
import {settleSession, getUserHistory} from "../controllers/orchestrator.controllers.js"


const router = Router();

router.route("/settle_session").post(settleSession);
router.route("/get_history").get(getUserHistory);

export default router;
