import express from "express"
import {getTodos, createTodo, updateTodo, deleteTodo} from "../controllers/TodoController"
import { authMiddleware } from "../middlewares/authmiddleware"

const router = express.Router()

router.use(authMiddleware)

router.get("/", getTodos)
router.post("/", createTodo)
router.put("/:id", updateTodo)
router.delete("/:id", deleteTodo)

export default router