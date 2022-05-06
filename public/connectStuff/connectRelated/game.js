// working code
import {Game, shuffleArray, Point, randomSelection} from "/modules/index.js"
// code completion
// import * as G from "../../easy-educational-games/public/modules/index.js"

const canvas = document.getElementById('game');
canvas.width = 600;
canvas.height = 600;

const game = new Game(canvas);

function createStringElement() {
    const stringElement = game.createElement()
    stringElement.createText("Spoj obrázky, ktoré sa k sebe hodia.")
    return stringElement
}

function stringToElement(string) {
    const element = game.createElement({visible:false,name:string})
    element.createImage(string+".png",{width:imageSize,height:imageSize})
    element.addOnDragListener(drawLine)

    element.addOnFinishDraggingListener(onFinishDragging)
    return element

}

function createElementArray() {
    return obrazky.map(dvojica=>dvojica.map(obr=>stringToElement(obr)))
}

function clearGame() {
    if (visibleImages) {
        for (const e of visibleImages) {
            e.visible = false
            e.draggable = false
            e.stationary = false
        }
    }
}

function newGame() {
    clearGame()
    const fourPairs = randomSelection(elements,4)

    visibleImages = shuffleArray([].concat(...fourPairs))
    for (const i in visibleImages) {

        const element = visibleImages[i]
        element.draggable = true
        element.stationary = true
        element.visible = true
        element.setPosition(100 + i%4 * 130, 150 + Math.floor(i/4) * 300)
    }
}

function createNewGameButton() {
    const newGameButton = game.createButton({text:"Nová hra",action:newGame})

    newGameButton.setPosition(canvas.width-52,canvas.height-27)
    return newGameButton
}

function createConnectingLine() {
    const lineElement = game.createElement({level:Number.POSITIVE_INFINITY})

    lineElement.setPosition(0,0)
    return lineElement.createShape("line", {coords:[0,0,0,0],stroke:"black",lineWidth:3})
}

function drawLine() {
    connectingLine.setLine(this.center,this.shared.mousePos)
}

function getOpposite(name) {

    for (const pair of obrazky) {
        if (pair.includes(name)) {
            if (pair[0] === name) {
                return pair[1]
            }
            return pair[0]
        }
    }
    return undefined
}

function onFinishDragging() {

    connectingLine.setLine(new Point(0, 0), new Point(0, 0))
    const finishElement = game.getElementAtPos(this.shared.mousePos)

    if (!finishElement) {

        return
    }
    if (finishElement.name === getOpposite(this.name)) {

        //correct
        correctAudio.currentTime = 0
        correctAudio.play()
        this.animateTo(finishElement.center)

        this.draggable = false
        finishElement.draggable = false
    } else {
        //incorrect
        incorrectAudio.currentTime = 0
        incorrectAudio.play()
    }
}

const obrazky = [
    ["dvere","okno"],
    ["voda","pohar"],
    ["banan","opica"],
    ["plavky","plaz"],
    ["oblak","slnko"],
    ["capica","fajka"],
    ["peniaze","penazenka"],
]

const imageSize = 100
const correctAudio = new Audio("/resources/win1.mp3")
const incorrectAudio = new Audio("/resources/lose1.mp3")

const stringElement = createStringElement()
const connectingLine = createConnectingLine()
const newGameButton = createNewGameButton()
let visibleImages = undefined
const elements = createElementArray()

newGame()

game.addOnMouseDownListener(function (event) {
    if (event.buttons === 4) {
        game.screenShot()
    }
})