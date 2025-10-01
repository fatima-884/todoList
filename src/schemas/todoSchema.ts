import { z } from "zod"
import mongoose from "mongoose"

export const createTodoSchema = z.object({
    title: z.string().min(1, "Title is required"),
    completed: z.boolean().optional().default(false),
    user: z.string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId"
    })
})