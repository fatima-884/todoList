import mongoose, {Schema, Document} from "mongoose"

export interface User extends Document {
    name: string
    email: string
    password: string
    createdAt: Date
    updatedAt: Date
}

const UserSchema: Schema<User> = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,

    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    },
}, { timestamps: true })

export default mongoose.model<User>("User", UserSchema)