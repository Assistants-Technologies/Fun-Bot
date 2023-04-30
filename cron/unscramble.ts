import axios from "axios"
import { getRandomWord } from "../functions/generateWord"
import client from "../bot"

import { TextChannel, MessageCollector } from "discord.js"

export default async function () {
    const channel = client.channels.cache.get(
        process.env.UNSRAMBLE_CHANNEL_ID as string
    ) as TextChannel
    myFunction()

    async function myFunction() {
        const scrambler = new Unscramble()

        const word = await scrambler.generate()
        if (!word || !channel) return

        channel.send(`Unscramble this word: **${word}**`).then((msg) => {
            const collectorOptions = { time: 15 * 60 * 1000 }
            const collector = new MessageCollector(channel, collectorOptions)

            let correct = false

            collector.on("collect", (m) => {
                if (!m.reference || m.reference.messageId !== msg.id || m.author.bot) return

                if (scrambler.check(m.content.toLowerCase())) {
                    correct = true
                    msg.channel.send(`:tada: You got it right, ${m.author}!`)
                    collector.stop()
                } else {
                    msg.channel.send(`Sorry, ${m.author}, that's not the correct word.`)
                }
            })

            collector.on("end", () => {
                if (!correct) {
                    msg.channel.send(`Time's up! The word was **${scrambler.getWord()}**.`)
                }
            })
        })

        scheduleFunction()
    }

    function scheduleFunction() {
        // Generate a random delay between 1 and 2 hours (in milliseconds)
        const minDelay = 3 * 60 * 60 * 1000 // 3 hours in milliseconds
        const maxDelay = 4 * 60 * 60 * 1000 // 4 hours in milliseconds
        const randomDelay = minDelay + Math.floor(Math.random() * (maxDelay - minDelay))

        // Schedule the function to run after the random delay
        setTimeout(myFunction, randomDelay)
    }
}

class Unscramble {
    private word!: string
    private scrambled!: string

    constructor() {
        this.generate()
    }

    /**
     * Fetches a random word from the API and scrambles it.
     *
     * @returns The scrambled word.
     * @example
     * const scrambler = new Unscramble()
     * const word = await scrambler.generate()
     * if (!word) return
     *
     * console.log(word) // "lehlo"
     */
    public async generate(): Promise<string | undefined> {
        let word = await getRandomWord()
        if (!word) return undefined

        console.log(word)

        word = word.charAt(0).toUpperCase() + word.slice(1)

        this.word = word
        this.scrambled = this.scramble(word)
        if (this.scrambled === word) return this.generate()

        console.log(this.scrambled)

        return this.scrambled
    }

    /**
     * Checks if the given word is the correct word.
     * @param word The word to check.
     * @returns Whether the word is correct.
     * @example
     * const scrambler = new Unscramble()
     * const word = await scrambler.generate()
     * if (!word) return
     *
     * scrambler.check("hello") // false
     * scrambler.check(word) // true
     **/
    public check(word: string): boolean {
        console.log({
            word,
            scrambled: this.scrambled,
            correct: word === this.scrambled,
            realWord: this.word
        })
        return word === this.word.toLowerCase()
    }

    /**
     * Scrambles the given word.
     * @param word The word to scramble.
     * @returns The scrambled word.
     *
     **/
    private scramble(word: string): string {
        const wordArr = word.split("")
        const length = wordArr.length

        for (let i = length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1))
            ;[wordArr[i], wordArr[randomIndex]] = [wordArr[randomIndex], wordArr[i]]
        }

        return wordArr.join("")
    }

    /**
     * Gets the unscrambled word.
     * @returns The unscrambled word.
     * @example
     * const scrambler = new Unscramble()
     * const word = await scrambler.generate()
     * if (!word) return
     *
     * console.log(scrambler.getWord()) // "hello"
     * console.log(word) // "lehlo"
     * console.log(scrambler.check(word)) // false
     * console.log(scrambler.check(scrambler.getWord())) // true
     **/
    public getWord(): string {
        return this.word
    }
}
