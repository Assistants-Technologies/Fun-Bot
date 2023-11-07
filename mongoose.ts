import { connect, set } from "mongoose"

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
