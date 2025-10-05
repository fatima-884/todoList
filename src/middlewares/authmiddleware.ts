import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/user"

const JWT_SECRET = process.env.JWT_SECRET as string

export interface AuthRequest extends Request {
    user?: any
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" })
    }

    const token = authHeader.split(" ")[1]
    if (!token) {
        return res.status(401).json({ message: "No token provided" })
    }

    try { 
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
        req.user = await User.findById(decoded.userId).select("-password")
        if (!req.user) {
            return res.status(401).json({ message: "User not found" })
        }
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}