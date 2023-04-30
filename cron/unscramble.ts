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
                    msg.channel.send(`Time's up! The word was **${scrambler.word}**.`)
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
    /**
     *  The orginal word.
     **/
    public word!: string
    /**
     * The scrambled word.
     **/
    private scrambled!: string

    constructor() {}

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

        this.word = word
        this.scrambled = this.scramble(word)

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
     * scrambler.check("lleho") // false
     * scrambler.check("hello") // true
     **/
    public check(word: string): boolean {
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
}
