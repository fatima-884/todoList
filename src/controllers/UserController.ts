import type { Request, Response, NextFunction } from "express"
import bcrypt from "bcryptjs"
import User from "../models/user"
import { createUserSchema } from "../schemas/userSchema"
import { z } from "zod"
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = createUserSchema.parse(req.body)
        const hashedPassword = await bcrypt.hash(validatedData.password, 10)
        const user = new User({ ...validatedData, password: hashedPassword })
        await user.save()
        res.status(201).json({ ...user.toObject(), password: undefined })
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: error.issues.map(issue => issue.message)})
        }
        next(error)
    }
}
