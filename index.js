const express = require("express")
const http = require("http")

const PORT = process.env.PORT || 3000
const APP = express()
const SERVER = http.createServer(APP)

const G = require("easy-educational-games")

//set public folder (this page)
APP.use(express.static("./public"))
//set module folder (client side)
APP.use("/modules",express.static(G.modulesPath))

//todo socket.io server

SERVER.listen(PORT, () => console.log(`Server running on port ${PORT}`))

