import client from "../bot"
import glob from "glob-promise"
import path from "path"

export default async function () {
    const files = await glob(`${__dirname}/../events/**/*.*`)
    for (const file of files) {
        if (file.endsWith(".d.ts")) continue
        const filePath = path.resolve(file)
        const eventFile = require(filePath)
        const event = eventFile.default

        if (!event.name) continue
        if (event.once) {
            client.once(event.name, (...args: any) => event.execute(...args))
        } else {
            client.on(event.name, async (...args: any) => {
                await event.execute(...args)
            })
        }
    }
}
