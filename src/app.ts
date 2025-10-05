import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db"
import userRoutes from "./routes/userRoutes"
import todoRoutes from "./routes/todoRoutes"
import authRoutes from "./routes/authRoutes"

dotenv.config()
connectDB()
const app = express()
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/todos", todoRoutes)

app.get("/", (req, res) => {
    res.send("API is running...")
})
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" })
})

export default app