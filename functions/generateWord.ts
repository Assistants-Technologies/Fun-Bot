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
export async function getRandomWord(difficulty: "easy" | "medium" | "hard"): Promise<{
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

    const { minCorpusCount, maxCorpusCount } = difficultyLevels[difficulty] || difficultyLevels.easy

    try {
        const wordReq = await axios.get<RandomWord>(
            `https://api.wordnik.com/v4/words.json/randomWord?api_key=c23b746d074135dc9500c0a61300a3cb7647e53ec2b9b658e&minCorpusCount=${minCorpusCount}&maxCorpusCount=${maxCorpusCount}`
        )
        const word: string = wordReq.data.word

        const defReq = await axios.get<WordDefinition>(
            `https://api.wordnik.com/v4/word.json/${word}/definitions?limit=1&api_key=c23b746d074135dc9500c0a61300a3cb7647e53ec2b9b658e`
        )
        const useReq = await axios.get<WordUsage>(
            `https://api.wordnik.com/v4/word.json/${word}/topExample?limit=1&api_key=c23b746d074135dc9500c0a61300a3cb7647e53ec2b9b658e`
        )

        let definition: string, usage: string

        Array.isArray(defReq.data[0].text)
            ? (definition = defReq.data[0].text.join())
            : (definition = defReq.data[0].text)

        Array.isArray(useReq.data.text)
            ? (usage = useReq.data.text.join())
            : (usage = useReq.data.text)

        if (!isNaN(parseInt(word))) {
            return getRandomWord("easy")
        }
        if (word.includes(" ")) {
            return getRandomWord("easy")
        }
        if (word.length < 5 || word.length > 15) {
            return getRandomWord("easy")
        }
        if (monthNames.includes(word)) {
            return getRandomWord("easy")
        }
        if (/^[a-zA-Z]+$/.test(word) === false) {
            return getRandomWord("easy")
        }

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
