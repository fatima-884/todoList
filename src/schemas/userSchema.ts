import { z } from "zod"

export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters")
})


