import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import User from "../models/user"
import { updateUserSchema, userIdSchema } from "../schemas/userSchema"
import { z } from "zod"
import type { AuthRequest } from "../middlewares/authmiddleware"

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select("name email -_id")
        res.status(200).json(users)
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Something went wrong" })
    }
}

export const getUserById = async (req: AuthRequest, res: Response) => {
    try {
        const id = userIdSchema.parse(req.params.id)
        if (req.user._id.toString() !== id) {
            return res.status(403).json({message: "Access denied"})
        }
        const user = await User.findById(id).select("-password")
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        res.status(200).json(user)
    } catch (error: any){
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: error.issues.map(issue => issue.message)})
        }
        res.status(500).json({message: error.message || "Something went wrong"})
    }
}

export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const id = userIdSchema.parse(req.params.id)
        if (req.user._id.toString() !== id) {
            return res.status(403).json({message: "Access denied"})
        }
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        const validatedData = updateUserSchema.parse(req.body)
        if (validatedData.name) user.name = validatedData.name
        if (validatedData.email) user.email = validatedData.email
        if (validatedData.password) {
            user.password  = await bcrypt.hash(validatedData.password, 10)
        }
        await user.save()
        res.status(200).json({ 
            message: "User updated successfully",
            user: {...user.toObject(), password: undefined}
        })

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: error.issues.map(issue => issue.message)})
        }
        res.status(500).json({message: error.message || "Something went wrong"})
    }
}

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const id = userIdSchema.parse(req.params.id)
        if (req.user._id.toString() !== id) {
            return res.status(403).json({message: "Access denied"})
        }
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        res.status(200).json({ message: "User deleted successfully" })
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: error.issues.map(issue => issue.message)})
        }
        res.status(500).json({message: error.message || "Something went wrong"})
    }
}
