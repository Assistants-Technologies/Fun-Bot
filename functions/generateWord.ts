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

export async function getRandomWord(): Promise<string> {
    try {
        const response = await axios.get("https://api.datamuse.com/words", {
            params: {
                sp: "^[a-zA-Z]+$", // matches only letters
                max: 1,
                md: "p",
                v: "enwiki" // only return words known to be in the dictionary
            }
        })

        console.log(response.data)

        // const word = response.data[Math.floor(Math.random() * response.data.length)].word

        // if (!isNaN(parseInt(word))) {
        //     return getRandomWord()
        // }
        // if (word.includes(" ")) {
        //     return getRandomWord()
        // }
        // if (word.length < 5 || word.length > 15) {
        //     return getRandomWord()
        // }
        // if (monthNames.includes(word)) {
        //     return getRandomWord()
        // }
        // if (/^[a-zA-Z]+$/.test(word) === false) {
        //     return getRandomWord()
        // }

        return "poo"

        // return word
    } catch (error) {
        console.error(error)
        return "" // Return empty string if there is an error
    }
}
