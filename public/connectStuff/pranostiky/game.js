// working code
import {Game, randomLightColor, randomSelection} from "/modules/index.js"
// code completion
// import * as G from "../../easy-educational-games/public/modules/index.js"

const canvas = document.getElementById('game');
canvas.width = 960;
canvas.height = 540;

const game = new Game(canvas);

function createLeftShape(text) {
    const element = game.createElement({draggable:true,name:text})
    const textDrawable = element.createText(text)
    const textWidth = textDrawable.measureText(element.shared.tempContext).width
    const width = Math.floor(textWidth) + 15
    element.createShape("polygon", {coords:[
            -(width/2),-15,
            (width/2),-15,
            (width/2),-7,
            (width/2)+15,0,
            (width/2), 7,
            (width/2),15,
            -(width/2),15,
    ], level:-1, name:"left shape", stroke:"black"})

    element.addHitbox(15,(width/2)+15)

    element.addOnFinishDraggingListener(onFinishDragging)

    return element
}

function createRightShape(text) {
    const element = game.createElement({draggable:true,name:text})
    const textDrawable = element.createText(text)
    const textWidth = textDrawable.measureText(element.shared.tempContext).width
    const width = Math.floor(textWidth) + 15
    element.createShape("polygon", {coords:[
            -(width/2)-15,-15,
            (width/2),-15,
            (width/2),15,
            -(width/2)-15,15,
            -(width/2)-15,7,
            -(width/2),0,
            -(width/2)-15,-7,
        ], level:-1, name:"right shape", stroke:"black"})

    element.addHitbox(15,-(width/2)-10)

    element.addOnFinishDraggingListener(onFinishDragging)

    return element
}

function createShapesFromArray(array) {
    for (const pair of array) {
        const left = createLeftShape(pair[0])
        left.setPosition(
            (Math.random() * canvas.width/4) + 100,
            (Math.random() * (canvas.height - 100)) + 50
        )
        left.getChildByName("left shape").fill = randomLightColor()
        const right = createRightShape(pair[1])
        right.setPosition(
            (Math.random() * canvas.width/4) + canvas.width/3 + 200,
            (Math.random() * (canvas.height - 100)) + 50
        )
        right.getChildByName("right shape").fill = randomLightColor()
    }
}

function getOpposite(name) {
    for (const pair of pranostiky) {
        if (pair.includes(name)) {
            if (pair[0] === name) {
                return pair[1]
            }
            return pair[0]
        }
    }
    return undefined
}

function mergeElements(e1,e2) {
    let left,right
    try {
        e1.getChildByName("left shape")
        left = e1
        right = e2
    } catch (e) {
        right = e1
        left = e2
    }

    const lShape = left.getChildByName("left shape")
    const rShape = right.getChildByName("right shape")

    const distance = Math.abs(lShape.coords[2])+Math.abs(rShape.coords[0])

    if (e1 === left) {
        left.setPosition(
            right.center.x - distance,
            right.center.y
        )
        lShape.fill = rShape.fill
    } else {
        right.setPosition(
            left.center.x + distance,
            left.center.y
        )
        rShape.fill = lShape.fill
    }

    const composite = game.createComposite({draggable:true})
    composite.addElements(left,right)
    return composite
}

function onFinishDragging() {
    const collisions = game.checkCollisions(this)
    if (collisions.length === 0) {
        return
    }
    const opposite = getOpposite(this.name)
    const correctCollision = collisions.filter(el => el.name === opposite)
    if (correctCollision.length === 0) {
        return
    }
    mergeElements(this,correctCollision[0])

    correctAudio.currentTime = 0
    correctAudio.play()

    remainingSentences = remainingSentences.filter(pair=>!pair.includes(opposite))

    if (remainingSentences.length === 0) {
        setTimeout(function () {
            alert("You finished the game, but you can play again!")
            resetGame()
        },50)
    }
}

function resetGame() {
    game.clear()

    newGameButton = createNewGameButton()
    //zamiesaj a vyber pocet
    remainingSentences = randomSelection(pranostiky,5)
    //vykresli
    createShapesFromArray(remainingSentences)
}

function createNewGameButton() {
    const button = game.createButton({text:"Nov?? Hra",color:"orange",action:resetGame})
    button.setPosition(50,25)
    return button
}

const pranostiky = [
    ["Od Jakuba do Hany", "nik nevidel letie?? vrany."],
    ["Chladn?? m??j -", "pre ovocie raj."],
    ["Ak je m??j z??hradn??kom,", "b??va i ro??n??kom."],
    ["Ner??d tomu sedliak b??va,", "ke?? mu v apr??li nepr??ieva."],
    ["Ke?? v m??ji nepr????,", "j??n sucho dov????i."],
    ["Marec bez vody,", "apr??l bez tr??vy."],
    ["Kto nenasial hrachu v marci,", "nebude ho vari?? v hrnci."],
    ["Pla??iv?? Dorota,", "omrzl?? robota."],
    ["D??????, ktor?? v auguste do obeda pr????,", "skorej ako obed minie sa usu????."],
    ["Ak na Ondreja lietaj?? v??ely,", "bude ne??rodn?? rok."],
]

let remainingSentences = []
const correctAudio = new Audio("/resources/win1.mp3")
let newGameButton = createNewGameButton()

resetGame()

game.addOnMouseDownListener(function (event) {
    if (event.buttons === 4) {
        game.screenShot()
    }
})