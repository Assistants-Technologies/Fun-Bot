import { Schema, model } from "mongoose"

import type Word from "../typings/word"

export default model<Word>(
    "word",
    new Schema<Word>({
        word: {
            type: [String],
            required: true
        }
    })
)
