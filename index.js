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

APP.set("port",PORT)
APP.listen(PORT,"0.0.0.0",()=>{
    console.log('Listening to port:  ' + 3000);
})

// APP.get('/', (req, res) => {
//     res.send("GET Request Called")
// })
//
// APP.listen(PORT, function(err){
//     if (err) console.log(err);
//     console.log("Server listening on PORT", PORT);
// });

//todo socket.io server

// SERVER.listen(PORT, () => console.log(`Server running on port ${PORT}`))

