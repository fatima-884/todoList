import mongoose from "mongoose"
import { z } from "zod"

export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters")
})

export const updateUserSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.email().optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional()
})

export const userIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {message: "Invalid ObjectId"})