import express from "express"
import {getTodos, createTodo} from "../controllers/TodoController"

const router = express.Router()

router.get("/", getTodos)

router.post("/", createTodo)

export default router