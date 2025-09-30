import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db"
import userRoutes from "./routes/userRoutes"
import { errorHandler } from "./middlewares/errorHandler"

dotenv.config()
connectDB()

const app = express()
app.use(express.json())

app.use("/api/users", userRoutes)

app.get("/", (req, res) => {
    console.log("Hello World")
    res.send("API is running...")
})

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" })
})

app.use(errorHandler)

export default app