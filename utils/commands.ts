import client from "../bot"
import path from "path"
import glob from "glob-promise"
import { Collection } from "discord.js"

import { REST, Routes } from "discord.js"

export default async function () {
    // const files = await glob(`${__dirname}/../commands/**/*.*`)
    // const commands = []
    // client.commands = new Collection()
    // for (const file of files) {
    //     const filePath = path.resolve(file)
    //     const fileContent = require(filePath)
    //     const command = fileContent.default
    //     if ("data" in fileContent.default && "execute" in fileContent.default) {
    //         client.commands.set(command.name, command)
    //         commands.push(command.data.toJSON())
    //     }
    // }
    // // Construct and prepare an instance of the REST module
    // const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN as string)
    // // and deploy your commands!
    // ;(async () => {
    //     try {
    //         console.log(`Started refreshing ${commands.length} application (/) commands.`)
    //         // The put method is used to fully refresh all commands in the guild with the current set
    //         const data = await rest.put(
    //             Routes.applicationGuildCommands(
    //                 process.env.CLIENT_ID as string,
    //                 process.env.PRODUCTION === "true"
    //                     ? (process.env.PROD_GUILD_ID as string)
    //                     : (process.env.GUILD_ID as string)
    //             ),
    //             {
    //                 body: commands
    //             }
    //         )
    //         console.log(`Successfully reloaded ${commands.length} application (/) commands.`)
    //     } catch (error) {
    //         // And of course, make sure you catch and log any errors!
    //         console.error(error)
    //     }
    // })()
}
