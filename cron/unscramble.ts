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
        if (!word) return
        if (!channel) return

        channel.send(`Unscramble this word: **${word}**`).then((msg) => {
            const collector = new MessageCollector(channel, {
                time: 60 * 1000,
                max: 1
            })

            let correct = false

            collector.on("collect", (m) => {
                if (scrambler.check(m.content.toLowerCase())) {
                    correct = true
                    msg.channel.send(`:tada: You got it right, ${m.author}!`)
                } else {
                    msg.channel.send(`Sorry, ${m.author}, that's not the correct word.`)
                }
                collector.stop()
            })

            collector.on("end", () => {
                if (!correct)
                    msg.channel.send(`Time's up! The word was **${scrambler.getWord()}**.`)
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
    public check: (word: string) => boolean
    public generate: () => Promise<string | undefined>
    public getWord: () => string
    private scramble: (word: string) => string

    constructor() {
        this.generate = async (): Promise<string | undefined> => {
            const word = await getRandomWord()
            if (!word) return undefined

            console.log(word)

            this.word = word

            const scrambled = this.scramble(word)

            this.scrambled = scrambled

            console.log(this.scrambled)

            return scrambled
        }

        this.check = (word: string) => {
            return word === this.word.toLowerCase()
        }

        this.scramble = (word: string) => {
            const wordArr = word.split("")
            let currentIndex = wordArr.length

            while (currentIndex !== 0) {
                const randomIndex = Math.floor(Math.random() * currentIndex)
                currentIndex--

                // Swap elements
                ;[wordArr[currentIndex], wordArr[randomIndex]] = [
                    wordArr[randomIndex],
                    wordArr[currentIndex]
                ]
            }

            return wordArr.join("")
        }

        this.getWord = () => {
            return this.word
        }

        return this
    }
}
