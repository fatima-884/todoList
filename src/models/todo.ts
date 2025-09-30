import mongoose, { Document, Schema } from "mongoose"
import type { User } from "./user"

export interface Todo extends Document {
    title: string
    completed: boolean
    user: User["_id"]
    createdAt: Date
    updatedAt: Date
}

const TodoSchema: Schema<Todo> = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    completed: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

export default mongoose.model<Todo>("Todo", TodoSchema)




