import type { Request, Response} from "express"
import Todo from "../models/todo"
import { createTodoSchema } from "../schemas/todoSchema"
import { z } from "zod"

export const getTodos = async (req: Request, res: Response) => {
    try {
        const todos = await Todo.find()
        res.status(200).json(todos)
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Something went wrong" })
    }
}

export const createTodo = async (req: Request, res: Response) => {
    try {
        const validatedData = createTodoSchema.parse(req.body)
        const todo = new Todo(validatedData)
        await todo.save()
        res.status(201).json(todo)
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: error.issues.map(issue => issue.message)})
        }
        res.status(500).json({message: error.message || "Something went wrong"})
    }
}