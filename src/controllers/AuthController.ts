import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user"
import { createUserSchema } from "../schemas/userSchema"
import { loginSchema } from "../schemas/loginSchema"
import { z } from "zod"

const JWT_SECRET = process.env.JWT_SECRET as string
const JWT_EXPIRES_IN = "1d"

export const register = async (req: Request, res: Response) => {
    try {
        const validatedData = createUserSchema.parse(req.body)
        const existingUser = await User.findOne({ email: validatedData.email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10)
        const user = new User({ ...validatedData, password: hashedPassword })
        await user.save()
        res.status(201).json({
            message: "User created successfully",
            user: { ...user.toObject(), password: undefined }
        })
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: error.issues.map(issue => issue.message)})
        }
        res.status(500).json({message: error.message || "Something went wrong"})
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const validatedData = loginSchema.parse(req.body)
        const user = await User.findOne({ email: validatedData.email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const isValid = await bcrypt.compare(validatedData.password, user.password)
        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        )
        res.status(200).json({
            message: "Login successful",
            token,
            user: { ...user.toObject(), password: undefined }
        })
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: error.issues.map(issue => issue.message)})
        }
        res.status(500).json({message: error.message || "Something went wrong"})
    }
}