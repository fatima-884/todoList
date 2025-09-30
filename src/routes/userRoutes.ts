import express from "express"
import { getUsers, createUser } from "../controllers/UserController"

const router = express.Router()

router.get("/", getUsers)

router.post("/", createUser)

export default router