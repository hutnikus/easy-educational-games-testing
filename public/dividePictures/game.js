// working code
import * as G from "../modules/index.js"
// code completion
// import * as G from "../../easy-educational-games/public/modules/index.js"

const canvas = document.getElementById('game');
canvas.width = 960;
canvas.height = 540;

const game = new G.Game(canvas);

///////////////////////////////////////////////

function createElements() {
    const elements = []
    for (const name of [...fruits,...vegetables]) {
        const el = game.createElement({draggable:true,clickable:true,name:name})
        el.createImage(name + ".png")

        el.addOnClickListener(onClick)
        el.addOnFinishDraggingListener(onFinishDragging)

        elements.push(el)
    }
    return elements
}

function randomElements(number) {
    number = Math.min(number,elements.length)

    function shuffleArray(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    const array = shuffleArray([...elements])
    return array.slice(0,number)
}

function placeVisibleElements() {
    for (const element of visibleElements) {
        element.setPosition(
            (Math.random()*(canvas.width - 100)) + 50,
            (Math.random()*(canvas.height/3 - 100)) + 50,
        )
        element.visible = true
    }
}

function createBackground() {
    const bg = game.createElement({level:-10})
    bg.createShape("rectangle", {width:canvas.width,height:canvas.height,fill:"#ffe8c8"})
}

function createAreas() {
    const SPACE = 20
    const fruitArea = game.createElement({level:-1,name:"fruitArea",clickable:true})
    fruitArea.createShape("rectangle", {width:canvas.width/2 - SPACE,height:canvas.height*(2/3) - SPACE,
        stroke:"black",lineWidth:5,fill:"#ffe8c8"
    })
    fruitArea.createText("fruit",{dy:20+(SPACE/2)-canvas.height/3,font:"30px Comic Sans MS"})
    fruitArea.setPosition(canvas.width/4,canvas.height*(2/3))

    const vegetableArea = game.createElement({level:-1,name:"vegetableArea",clickable:true})
    vegetableArea.createShape("rectangle", {width:canvas.width/2 - SPACE,height:canvas.height*(2/3) - SPACE,
        stroke:"black",lineWidth:5,fill:"#ffe8c8"
    })
    vegetableArea.createText("vegetables",{dy:20+(SPACE/2)-canvas.height/3,font:"30px Comic Sans MS"})
    vegetableArea.setPosition(canvas.width*(3/4),canvas.height*(2/3))
    return {
        fruit: fruitArea,
        vegetable: vegetableArea
    }
}

function getRelevantArea(element) {
    if (fruits.includes(element.name)) {
        return areas.fruit
    }
    if (vegetables.includes(element.name)) {
        return areas.vegetable
    }
    throw new Error("Incorrect element!")
}

function insideCorrectArea(element) {
    const area = getRelevantArea(element)

    return area.isInside(element.center)
}

function onClick() {
    this.lastPosition = this.center
}

function onFinishDragging() {
    if (!insideCorrectArea(this)) {
        this.center = this.lastPosition
        incorrectAudio.currentTime = 0
        incorrectAudio.play()
        return
    }
    this.draggable = false
    this.clickable = false

    correctAudio.currentTime = 0
    correctAudio.play()

    if (visibleElements.every(e=>!e.draggable)) {
        gameFinish()
    }
}

function createWinText() {
    const element = game.createElement()
    return element.createText("Nice job!",{font:"100px Comic Sans MS",dy:-canvas.height/3,visible:false})
}

function gameFinish() {
    winText.visible = true
}

function resetGame() {
    for (const element of elements) {
        element.draggable = true
        element.clickable = true
        element.visible = false
    }
    winText.visible = false

    visibleElements = randomElements(5)
    placeVisibleElements()
}

///////////////////////////////////////////

const vegetables = [
    "baklazan",
    "brokolica",
    "cibula",
    "hrach",
    "kukurica",
    "paradajky",
    "petrzlen",
    "redkovka",
    "tekvica",
    "uhorky",
    "kapusta"

]
const fruits = [
    "broskyna",
    "egres",
    "jablko",
    "jahoda",
    "melon",
    "slivka",
    "ceresna",
    "hruska",
    "malina",
    "orech",
    "visna"
]

const correctAudio = new Audio("/resources/win1.mp3")
const incorrectAudio = new Audio("/resources/lose2.mp3")

createBackground()
const areas = createAreas()
const winText = createWinText()

const elements = createElements()
let visibleElements
resetGame()

const resetButton = game.createButton({
    text:"reset",
    action:resetGame,
})
resetButton.setPosition(canvas.width-55,30)