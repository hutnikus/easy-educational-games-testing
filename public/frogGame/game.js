// working code
import * as G from "../modules/index.js"
// code completion
// import * as G from "../../easy-educational-games/public/modules/index.js"

const canvas = document.getElementById('game');
canvas.width = 600;
canvas.height = 600;

const game = new G.Game(canvas);

function frogFlyGame() {
    game.clear()

    const grid = game.createGrid(50,50,500,500,10,10)

    const frogElement = game.createElement({pressable:true})
    frogElement.createImage("frog.png",{width:grid.columnWidth(),height:grid.rowHeight()})
    grid.addElement(...grid.randomFreePosition().asArray(),frogElement)

    const flyElement = game.createElement({name:"fly"})
    flyElement.createGif("fly",{width:grid.columnWidth(),height:grid.rowHeight(),stagger:2})
    grid.addElement(...grid.randomFreePosition().asArray(),flyElement)

    let score = 0
    const scoreElement = game.createElement()
    const scoreText = scoreElement.createText(`Score: ${score}`)
    scoreElement.setPosition(100,25)

    function placeFly() {
        const freePos = grid.randomFreePosition()
        grid.placeElement(...freePos.asArray(), flyElement)
    }

    const stagger = 5

    function moveFrog(event,dir) {
        const direction = {
            up: new G.Point(0,-1),
            down: new G.Point(0,1),
            left: new G.Point(-1,0),
            right: new G.Point(1,0)
        }
        const currentPos = grid.getPosFromPixels(...this.center.asArray())
        const nextPos = currentPos.add(direction[dir])

        try {
            const element = grid.getElementAtPos(...nextPos.asArray())
            if (element && element.name === "fly") {
                //position is occupied
                score++
                scoreText.text = `Score: ${score}`
                grid.removeElementAtPosition(...nextPos.asArray())
                this.move(direction[dir])
                placeFly()
                updateStorks()
            } else if (!element) {
                this.move(direction[dir])
            } else {
                alert(`Congrats! You made it to ${score} points!`)
                frogFlyGame()
            }
        } catch (e) {
            if (!(e instanceof RangeError)) {
                throw e
            }
        }
    }

    frogElement.addOnKeyHoldListener("w",function (event) {moveFrog.call(this,event,"up")},stagger)
    frogElement.addOnKeyHoldListener("s",function (event) {moveFrog.call(this,event,"down")},stagger)
    frogElement.addOnKeyHoldListener("a",function (event) {moveFrog.call(this,event,"left")},stagger)
    frogElement.addOnKeyHoldListener("d",function (event) {moveFrog.call(this,event,"right")},stagger)

    const arrows = [    {direction: "up", position: [300,25], coords: [0,-25,-100,25,100,25]},
        {direction: "left", position: [25,300], coords: [-25,0,25,-100,25,100]},
        {direction: "down", position: [300,575], coords: [0,25,-100,-25,100,-25]},
        {direction: "right", position: [575,300], coords: [25,0,-25,-100,-25,100]}    ]

    for (const arrow of arrows) {
        const element = game.createElement({holdable:true})
        element.setPosition(...arrow.position)
        element.createShape("polygon",{coords:arrow.coords})

        element.addOnMouseHoldListener(()=> {
            moveFrog.call(frogElement,undefined,arrow.direction)
        },stagger)
    }

    const storks = []
    function updateStorks(add=true) {
        if (add && score % 5 === 0) {
            //pridaj
            for (let i = 0; i < Math.floor(score/5); i++) {
                const storkElement = game.createElement()
                storks.push(storkElement)
                storkElement.createImage("stork.png",{width:grid.columnWidth(),height:grid.rowHeight()})

                if (storks.length >= grid.columns*grid.rows -2) {
                    break
                }
            }
        }
        //nahodne usporiadaj
        grid.removeElements(...storks)
        for (const stork of storks) {
            try {
                const freePos = grid.randomFreePosition()
                grid.addElement(freePos.x,freePos.y,stork)
            } catch (e) {
                if (e instanceof grid.FullError) {
                    alert("Wow, you surely have too much time on your hand, nice!")
                    break
                }
            }
        }
        if (storks.length >= grid.columns*grid.rows -2) {
            alert("Wow, you surely have too much time on your hand, nice!")
        }
    }

    const shuffleButton = game.createButton({color:"skyblue",width:150,height:30,text:"scare the storks"})
    shuffleButton.rectangle.lineWidth = 1
    shuffleButton.setPosition(500,25)
    const sound = new Audio("resources/croak.mp3")

    shuffleButton.addOnButtonPressListener(()=>{
        sound.currentTime = 0
        sound.play()
        updateStorks(false)
    })

    let playing = true
    const crickets = new Audio("resources/cricket.mp3")

    game.addOnClearListener(()=>{
        playing = false
    })

    function cricketLoop() {
        crickets.currentTime = 0
        crickets.play()
        if (playing) {
            setTimeout(cricketLoop, Math.floor(Math.random() * 10000) + 5000)
        }
    }
    cricketLoop()
}
frogFlyGame()