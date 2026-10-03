import { Router } from "express";
import {
    registerNodes
} from "../controllers/pseudo_node.controllers.js"

const router = Router();

router.route("/register").post(registerNodes)

export default router;