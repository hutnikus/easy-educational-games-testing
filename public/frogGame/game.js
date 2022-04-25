// working code
import {Game, Point} from "../modules/index.js"
// code completion
// import * as G from "../../easy-educational-games/public/modules/index.js"

const canvas = document.getElementById('game');
canvas.width = 600;
canvas.height = 600;

const game = new Game(canvas);

/////////////////////////////////////////////////////////

function createGrid() {
    return game.createGrid(50,50,500,500,10,10)
}

function createFrogElement() {
    const frogElement = game.createElement({pressable:true})
    frogElement.createImage("frog.png",{width:grid.columnWidth(),height:grid.rowHeight()})
    grid.addElement(...grid.randomFreePosition().asArray(),frogElement)

    frogElement.addOnKeyHoldListener("w",function (event) {moveFrog.call(this,event,"up")},stagger)
    frogElement.addOnKeyHoldListener("s",function (event) {moveFrog.call(this,event,"down")},stagger)
    frogElement.addOnKeyHoldListener("a",function (event) {moveFrog.call(this,event,"left")},stagger)
    frogElement.addOnKeyHoldListener("d",function (event) {moveFrog.call(this,event,"right")},stagger)

    return frogElement
}

function createFlyElement() {
    const flyElement = game.createElement({name:"fly"})
    flyElement.createGif("fly",{width:grid.columnWidth(),height:grid.rowHeight(),stagger:2})
    grid.addElement(...grid.randomFreePosition().asArray(),flyElement)
    return flyElement
}

function createScoreElementText() {
    const scoreElement = game.createElement()
    const scoreText = scoreElement.createText(`Score: ${currentScore}`)
    scoreElement.setPosition(100,25)
    return scoreText
}

function placeFly() {
    const freePos = grid.randomFreePosition()
    grid.placeElement(...freePos.asArray(), flyElement)
}

function moveFrog(event,dir) {
    const direction = {
        up: new Point(0,-1),
        down: new Point(0,1),
        left: new Point(-1,0),
        right: new Point(1,0)
    }
    const currentPos = grid.getPosFromPixels(...this.center.asArray())
    const nextPos = currentPos.add(direction[dir])

    try {
        const element = grid.getElementAtPos(...nextPos.asArray())
        if (element && element.name === "fly") {
            //position is occupied
            currentScore++
            scoreText.text = `Score: ${currentScore}`
            grid.removeElementAtPosition(...nextPos.asArray())
            this.move(direction[dir])
            placeFly()
            updateStorks()
        } else if (!element) {
            this.move(direction[dir])
        } else {
            alert(`Congrats! You made it to ${currentScore} points!`)
            frogFlyGame()
        }
    } catch (e) {
        if (!(e instanceof RangeError)) {
            throw e
        }
    }
}

function createArrowsElements() {
    const arrowsElements = []
    for (const arrow of arrowsSettings) {
        const element = game.createElement({holdable:true})
        element.setPosition(...arrow.position)
        element.createShape("polygon",{coords:arrow.coords})

        element.addOnMouseHoldListener(()=> {
            moveFrog.call(frogElement,undefined,arrow.direction)
        },stagger)

        arrowsElements.push(element)
    }
    return arrowsElements
}

function updateStorks(add=true) {
    if (add && currentScore % 5 === 0) {
        //pridaj
        for (let i = 0; i < Math.floor(currentScore/5); i++) {
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

function createShuffleButton() {
    const shuffleButton = game.createButton({color:"skyblue",width:150,height:30,text:"scare the storks"})
    shuffleButton.rectangle.lineWidth = 1
    shuffleButton.setPosition(500,25)

    shuffleButton.addOnButtonPressListener(()=>{
        shuffleSound.currentTime = 0
        shuffleSound.play()
        updateStorks(false)
    })

    return shuffleButton
}

function cricketLoop() {
    crickets.currentTime = 0
    crickets.play()
    if (playing) {
        setTimeout(cricketLoop, Math.floor(Math.random() * 10000) + 5000)
    }
}

//////////////////////////////////////////////////

const stagger = 5
const grid = createGrid()
const frogElement = createFrogElement()
const flyElement = createFlyElement()
let currentScore = 0
const scoreText = createScoreElementText()
const arrowsSettings = [    {direction: "up", position: [300,25], coords: [0,-25,-100,25,100,25]},
    {direction: "left", position: [25,300], coords: [-25,0,25,-100,25,100]},
    {direction: "down", position: [300,575], coords: [0,25,-100,-25,100,-25]},
    {direction: "right", position: [575,300], coords: [25,0,-25,-100,-25,100]}    ]
const arrowsElements = createArrowsElements()
const storks = []
const shuffleSound = new Audio("resources/croak.mp3")
const shuffleButton = createShuffleButton()

// let playing = true
// const crickets = new Audio("resources/cricket.mp3")
// cricketLoop()