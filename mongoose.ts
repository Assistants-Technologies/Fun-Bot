import { Schema, model, connect, set } from "mongoose"

// import type Question from "./typings/Question"

// const userSchema = new Schema<Question>({
//     id: { type: String, required: true, unique: true },
//     query: { type: String, required: true },
//     answer: { type: String, required: true },
//     match: { type: Number, default: 50 }
// })

set("strictQuery", true)

try {
    connect(
        process.env.PRODUCTION === "true"
            ? (process.env.MONGO_URL as string)
            : (process.env.MONGO_URL_DEV as string)
    )
} catch (error) {
    console.log("Failed to connect to MongoDB")
    console.error(error)
}

// export default model<Question>("Questions", userSchema)
