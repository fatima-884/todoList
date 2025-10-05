import { z } from "zod"

export const loginSchema = z.object ({
    email: z.email(),
    password: z.string().min(6, "Password is required, must be at least 6 characters")
})