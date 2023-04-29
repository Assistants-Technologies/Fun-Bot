import Discord, { Collection, SlashCommandBuilder } from "discord.js"
import cron from "./utils/cron"

class MyClient extends Discord.Client {
    commands: Discord.Collection<
        string,
        {
            autocomplete: (interaction: Discord.CommandInteraction) => Promise<void>
            name: string
            description: string
            usage: string
            aliases: string[]
            data: SlashCommandBuilder
            execute: (interaction: Discord.CommandInteraction) => Promise<void>
        }
    >
    constructor(options: any) {
        super(options)
        this.commands = new Collection()
    }
    loadCommands() {
        // enter code here
    }
}

const client = new MyClient({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildMessageTyping,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.MessageContent
    ],
    partials: [
        Discord.Partials.Channel,
        Discord.Partials.GuildMember,
        Discord.Partials.Message,
        Discord.Partials.Reaction,
        Discord.Partials.User
    ]
})

client.login(process.env.DISCORD_TOKEN)

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`)
    cron()
})

export default client
