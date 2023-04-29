import path from "path"
import glob from "glob-promise"

export default async function () {
    const files = await glob(`${__dirname}/../cron/*.*`)

    for (const file of files) {
        const filePath = path.resolve(file)
        const fileContent = require(filePath)

        const func = fileContent.default

        if (typeof func === "function") {
            func()
        }
    }
}
