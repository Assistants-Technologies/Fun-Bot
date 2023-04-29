import axios from "axios"

export async function getRandomWord(): Promise<string> {
    try {
        const response = await axios.get("https://api.datamuse.com/words", {
            params: {
                ml: 15,
                lc: 10, // Set the lower bound on word frequency to 10
                random: true
            }
        })

        const word = response.data[Math.floor(Math.random() * response.data.length)].word

        if (!isNaN(parseInt(word))) {
            return getRandomWord()
        }
        if (word.includes(" ")) {
            return getRandomWord()
        }
        if (word.length < 5 || word.length > 15) {
            return getRandomWord()
        }

        return word
    } catch (error) {
        console.error(error)
        return "" // Return empty string if there is an error
    }
}
