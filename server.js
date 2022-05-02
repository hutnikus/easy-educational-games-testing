const g = require("easy-educational-games")
const path = require("path");
//set static folder
g.app.use(g.express.static(path.join(__dirname,"public")))
g.app.listen(g.PORT,"0.0.0.0",
    ()=>console.log(`Server running on port ${g.PORT}`)
)