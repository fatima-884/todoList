import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db"

dotenv.config()
connectDB()

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    console.log("Hello World")
    res.send("API is running...")
})

export default app