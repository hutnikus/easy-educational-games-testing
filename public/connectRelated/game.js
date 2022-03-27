// working code
import * as G from "../modules/index.js"
// code completion
// import * as G from "../../easy-educational-games/public/modules/index.js"

const canvas = document.getElementById('game');
canvas.width = 600;
canvas.height = 600;

const center = new G.Point(
    canvas.width/2,
    canvas.height/2
)

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

    function stringToElement(string) {
        const element = game.createElement({visible:false,name:string})
        const image = element.createImage(string+".png",{width:100,height:100})

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

    async function onFinishDragging() {
        connectingLine.setLine(new G.Point(0, 0), new G.Point(0, 0))

        const finishElement = await game.getElementAtPos(this.shared.mousePos)

        if (!finishElement) {
            console.log("not nice")
            return
        }

        if (finishElement.name === getOpposite(this.name)) {
            console.log("nice")
            this.animateTo(finishElement.center)
            this.draggable = false
            finishElement.draggable = false
        } else {
            console.log("not nice")
        }
    }

}
connectRelated()

