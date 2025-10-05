import express from "express"
import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/UserController"
import { authMiddleware } from "../middlewares/authmiddleware"

const router = express.Router()

router.get("/", getUsers)

router.use(authMiddleware)
router.get("/:id", getUserById)
router.put("/:id", updateUser)
router.delete("/:id", deleteUser)


export default router