import axios from "axios"

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
export async function getRandomWord(): Promise<string> {
    try {
        const response = await axios.get("https://random-word-api.herokuapp.com/word")

        console.log(response.data[0])

        const word = response.data[0]

        if (!isNaN(parseInt(word))) {
            return getRandomWord()
        }
        if (word.includes(" ")) {
            return getRandomWord()
        }
        if (word.length < 5 || word.length > 15) {
            return getRandomWord()
        }
        if (monthNames.includes(word)) {
            return getRandomWord()
        }
        if (/^[a-zA-Z]+$/.test(word) === false) {
            return getRandomWord()
        }

        return word
        // return word
    } catch (error) {
        console.error(error)
        return "" // Return empty string if there is an error
    }
}
