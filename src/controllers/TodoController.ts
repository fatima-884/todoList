import type { Request, Response} from "express"
import Todo from "../models/todo"
import { createTodoSchema, todoIdSchema, updateTodoSchema } from "../schemas/todoSchema"
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

export const updateTodo = async (req: Request, res: Response) => {
    try {
        const id = todoIdSchema.parse(req.params.id)
        const todo = await Todo.findById(id)
        if (!todo) {
            return res.status(404).json({message: "Todo not found"})
        }
        const validatedData = updateTodoSchema.parse(req.body)
        if (validatedData.title) todo.title = validatedData.title
        if (validatedData.completed !== undefined) todo.completed = validatedData.completed
        await todo.save()
        res.status(200).json({message: "Todo updated successfully", todo})
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: error.issues.map(issue => issue.message)})
        }
        res.status(500).json({message: error.message || "Something went wrong"})
    }
}

export const deleteTodo = async (req: Request, res: Response) => {
    try {
        const id = todoIdSchema.parse(req.params.id)
        const todo = await Todo.findByIdAndDelete(id)
        if (!todo) {
            return res.status(404).json({message: "Todo not found"})
        }
        res.status(200).json({ message: "Todo deleted successfully" })
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: error.issues.map(issue => issue.message)})
        }
        res.status(500).json({message: error.message || "Something went wrong"})
    }
}