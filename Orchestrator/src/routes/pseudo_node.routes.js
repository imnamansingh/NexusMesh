import { Router } from "express";
import {
    registerNodes,
    addNode,
    removeNode
} from "../controllers/pseudo_node.controllers.js"

const router = Router();

router.route("/register").post(registerNodes)
router.route("/add_node").post(addNode)
router.route("/remove_node").post(removeNode)

export default router;