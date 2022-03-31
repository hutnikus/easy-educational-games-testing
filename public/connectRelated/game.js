// working code
import * as G from "../modules/index.js"
// code completion
// import * as G from "../../easy-educational-games/public/modules/index.js"

const canvas = document.getElementById('game');
canvas.width = 600;
canvas.height = 600;

const game = new G.Game(canvas);

function connectRelated() {
    game.clear()

    const obrazky = [
        ["dvere","okno"],
        ["voda","pohar"],
        ["banan","opica"],
        ["plavky","plaz"],
        ["oblak","slnko"],
        ["capica","fajka"],
        ["peniaze","penazenka"],
    ]

    const stringElement = game.createElement()
    stringElement.createText("Connect images that relate to each other")

    const imageSize = 100

    function stringToElement(string) {
        const element = game.createElement({visible:false,name:string})
        const image = element.createImage(string+".png",{width:imageSize,height:imageSize})

        element.addOnDragListener(drawLine)
        element.addOnFinishDraggingListener(onFinishDragging)

        return element
    }

    const elements = obrazky.map(dvojica=>dvojica.map(obr=>stringToElement(obr)))

    function shuffleArray(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function randomSelection(arr,length) {
        shuffleArray(arr)
        return arr.slice(0,length)
    }

    let visibleImages = undefined

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

    newGame()

    const newGameButton = game.createButton({text:"NEW GAME",action:newGame})
    newGameButton.setPosition(canvas.width-52,canvas.height-27)

    const lineElement = game.createElement()
    lineElement.setPosition(0,0)
    const connectingLine = lineElement.createShape("line", {coords:[0,0,0,0],stroke:"black",lineWidth:3})

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
        connectingLine.setLine(new G.Point(0, 0), new G.Point(0, 0))

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

    const correctAudio = new Audio("/resources/win1.mp3")
    const incorrectAudio = new Audio("/resources/lose1.mp3")

}
connectRelated()

