import http from "http"

const server = http.createServer(async (req, res) => {
    if (req.url === "/alive" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" })
        res.write("Hi there, This is a Vanilla Node.js API")
        res.end()
    }
})

server.listen(1033, () => {
    console.log(`Server started on port: ${1033}`)
})

require("dotenv").config({})

import events from "./utils/events"
import commands from "./utils/commands"

events()
commands()
