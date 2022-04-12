// working code
import * as G from "/modules/index.js"
// code completion
// import * as G from "../../easy-educational-games/public/modules/index.js"

const canvas = document.getElementById('game');
canvas.width = 960;
canvas.height = 540;

const game = new G.Game(canvas);

const pranostiky = [
    ["Od Jakuba do Hany", "nik nevidel letieť vrany."],
    ["Chladný máj -", "pre ovocie raj."],
    ["Ak je máj záhradníkom,", "býva i roľníkom."],
    ["Nerád tomu sedliak býva,", "keď mu v apríli nepršieva."],
    ["Keď v máji neprší,", "jún sucho dovŕši."],
    ["Marec bez vody,", "apríl bez trávy."],
    ["Kto nenasial hrachu v marci,", "nebude ho variť v hrnci."],
    ["Plačivá Dorota,", "omrzlá robota."],
    ["Dážď, ktorý v auguste do obeda prší,", "skorej ako obed minie sa usuší."],
    ["Ak na Ondreja lietajú včely,", "bude neúrodný rok."],
]

function randomLightColor() {
    const red = Math.floor(Math.random() * 50) + 200
    const green = Math.floor(Math.random() * 50) + 200
    const blue = Math.floor(Math.random() * 50) + 200

    return "#" + red.toString(16) + green.toString(16) + blue.toString(16)
}

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

function shuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function randomSelection(arr,length) {
    const array = shuffleArray([...arr])
    return array.slice(0,length)
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

let remainingSentences = []

const correctAudio = new Audio("/resources/win1.mp3")

function resetGame() {
    game.clear()

    //zamiesaj a vyber pocet
    remainingSentences = randomSelection(pranostiky,5)
    //vykresli
    createShapesFromArray(remainingSentences)
}

resetGame()