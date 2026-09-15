import {Router} from "express";
import {settleSession, getUserHistory} from "../controllers/orchestrator.controllers.js"


const router = Router();

router.route("/settleSession").post(settleSession);
router.route("/getHistory").get(getUserHistory);

export default router;
