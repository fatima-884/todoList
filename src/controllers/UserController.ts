import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import User from "../models/user"
import { createUserSchema, updateUserSchema, userIdSchema } from "../schemas/userSchema"
import { z } from "zod"

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select("-password")
        res.status(200).json(users)
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Something went wrong" })
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const validatedData = createUserSchema.parse(req.body)
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

export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = userIdSchema.parse(req.params.id)
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        res.status(200).json({ ...user.toObject(), password: undefined })
    } catch (error: any){
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: error.issues.map(issue => issue.message)})
        }
        res.status(500).json({message: error.message || "Something went wrong"})
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = userIdSchema.parse(req.params.id)
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        const validatedData = updateUserSchema.parse(req.body)
        if (validatedData.name) user.name = validatedData.name
        if (validatedData.email) user.email = validatedData.email
        if (validatedData.password) {
            validatedData.password  = await bcrypt.hash(validatedData.password, 10)
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

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = userIdSchema.parse(req.params.id)
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
