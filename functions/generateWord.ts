import axios from "axios"

import type { WordUsage, WordDefinition, RandomWord } from "../typings/wordAPI"

const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december"
]

/**
 *  Get a random word from the Datamuse API.
 * @returns The random word.
 * @example
 * const word = await getRandomWord()
 * if (!word) return
 *
 * console.log(word) // "hello"
 * **/
export async function getRandomWord(): Promise<{
    word: string
    definition: string
    usage: string

    error: boolean
}> {
    const difficultyLevels = {
        easy: { minCorpusCount: 50001, maxCorpusCount: 300000 },
        medium: { minCorpusCount: 10001, maxCorpusCount: 50000 },
        hard: { minCorpusCount: 1, maxCorpusCount: 10000 }
    }

    const { minCorpusCount, maxCorpusCount } =
        difficultyLevels[biasedRandomValue()] || difficultyLevels.easy

    try {
        const wordReq = await axios.get<RandomWord>(
            `https://api.wordnik.com/v4/words.json/randomWord?api_key=${process.env.WORDNIK}&minCorpusCount=${minCorpusCount}&maxCorpusCount=${maxCorpusCount}`
        )
        const word: string = wordReq.data.word

        const defReq = await axios.get<WordDefinition>(
            `https://api.wordnik.com/v4/word.json/${word}/definitions?limit=1&api_key=${process.env.WORDNIK}`
        )
        const useReq = await axios.get<WordUsage>(
            `https://api.wordnik.com/v4/word.json/${word}/topExample?limit=1&api_key=${process.env.WORDNIK}`
        )

        let definition: string, usage: string

        Array.isArray(defReq.data[0].text)
            ? (definition = defReq.data[0].text.join())
            : (definition = defReq.data[0].text)

        Array.isArray(useReq.data.text)
            ? (usage = useReq.data.text.join())
            : (usage = useReq.data.text)

        if (
            !isNaN(parseInt(word)) ||
            word.includes(" ") ||
            word.length < 5 ||
            word.length > 15 ||
            monthNames.includes(word) ||
            /^[a-zA-Z]+$/.test(word) === false
        )
            return getRandomWord()

        return {
            word,
            definition,
            usage,
            error: false
        }

        // return word
    } catch (error) {
        console.error(error)
        return {
            word: "",
            definition: "",
            usage: "",
            error: true
        }
    }
}

function biasedRandomValue() {
    const probabilities = [0.7, 0.2, 0.1] // Bias toward 1, less toward 2, small chance for 3
    const rand = Math.random()

    if (rand < probabilities[0]) return "easy"
    if (rand < probabilities[0] + probabilities[1]) return "medium"
    return "hard"
}
