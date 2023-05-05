import axios from "axios"
import { getRandomWord } from "../functions/generateWord"
import client from "../bot"

import { TextChannel, MessageCollector, EmbedBuilder } from "discord.js"

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
                    collector.stop()
                } else {
                    msg.channel.send(`Sorry, ${m.author}, that's not the correct word.`)
                }
            })

            collector.on("end", () => {
                end(correct, scrambler)
            })
        })

        scheduleFunction()
    }

    function end(correct: boolean, scrambler: Unscramble) {
        const embed = new EmbedBuilder()
            .setTitle("Unscramble Answer")
            .setDescription(
                `${correct ? ":tada: You got it right!" : ":x: No one guessed it in time!"}`
            )
            .addFields([
                {
                    name: "Scrambled Word",
                    value: scrambler.word
                },
                {
                    name: "Definition",
                    value: clean(scrambler.definition)
                },
                {
                    name: "Usage",
                    value: clean(scrambler.usage)
                }
            ])
            .setColor("Purple")
            .setFooter({
                text: "Powered by Wordnik",
                iconURL: "https://www.wordnik.com/favicon.ico"
            })
            .setTimestamp()

        channel.send({
            embeds: [embed]
        })
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

function clean(text: string) {
    const regex = /<(?!\/?(b|i|s|u))\/?[\w\s="-:;.#@%]+>/g
    const discordText = text
        .replace(regex, "")
        .replace(/<\/?b>/g, "**")
        .replace(/<\/?i>/g, "*")
        .replace(/<\/?s>/g, "~~")
        .replace(/<\/?u>/g, "__")

    return discordText
}
/**
 * A class to generate a scrambled word.
 *
 * @example
 * const scrambler = new Unscramble()
 * const word = await scrambler.generate()
 * if (!word) return
 *
 * console.log(word) // "lehlo"
 *
 * const definition = scrambler.definition
 * const usage = scrambler.usage
 *
 * console.log(definition) // "A word used to greet someone."
 * console.log(usage) // "Hello, how are you?"
 *
 * const correct = scrambler.check("hello")
 * console.log(correct) // true
 *
 * const correctWord = scrambler.word
 * console.log(correctWord) // "Hello"
 */
class Unscramble {
    /**
     *  The orginal word.
     **/
    public word!: string
    /**
     * The definition of the word.
     * */
    public definition!: string
    /**
     * The usage of the word.
     * */
    public usage!: string
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
        let { word, definition, usage, error } = await getRandomWord("easy")
        if (error) return undefined

        console.log(word)

        word = word.charAt(0).toUpperCase() + word.slice(1)

        this.word = word
        this.scrambled = this.scramble(word)
        if (this.scrambled === word) return this.generate()

        this.definition = definition
        this.usage = usage

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
