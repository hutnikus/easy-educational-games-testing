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

function scalesGame() {
    game.clear()

    const scaleBase = game.createElement()
    scaleBase.setPosition(300,100)
    scaleBase.createShape("line", {coords:[0,0,0,300],stroke:"black"})
    scaleBase.createShape("line", {coords:[-50,300,50,300],stroke:"black"})

    const scaleArm = game.createElement()
    scaleArm.setPosition(...scaleBase.center.asArray())
    scaleArm.createShape("line", {coords:[-200,0,200,0],stroke:"black"})

    const leftBucketShape = game.createElement()
    leftBucketShape.setPosition(...scaleBase.center.subtract(new G.Point(200,0)).asArray())
    leftBucketShape.createShape("line", {coords:[0,0,0,50,-50,150,50,150,0,50],stroke:"black"})

    const rightBucketShape = game.copyElement(leftBucketShape)
    rightBucketShape.setPosition(...scaleBase.center.add(new G.Point(200,0)).asArray())

    const cardOnScale = game.createElement()
    cardOnScale.setPosition(...leftBucketShape.center.add(new G.Point(0,135)).asArray())
    cardOnScale.createShape("rectangle",{width:30,height:30,fill:"tan",stroke:"black"})
    cardOnScale.createText("15",{name:"text"})

    const leftBucket = game.createComposite()
    leftBucket.setPosition(...leftBucketShape.center.asArray())
    leftBucket.addElements(leftBucketShape,cardOnScale)

    const rightBucket = game.createComposite()
    rightBucket.setPosition(...rightBucketShape.center.asArray())
    rightBucket.addElements(rightBucketShape)

    const buckets = game.createComposite()
    buckets.addElements(leftBucket,rightBucket)

    let currentRotation = 0
    let leftBucketValue = 15
    let rightBucketValue = 0

    function setScaleAngle(percent) {
        const angle0 = -0.4
        const angle = (angle0*-2 * percent) + angle0
        scaleArm.rotation = angle
        buckets.rotateElements(scaleBase.center,-currentRotation,true)
        buckets.rotateElements(scaleBase.center,angle,true)
        currentRotation = angle
    }

    setScaleAngle(0)

    // const slider = game.createRangeSlider({width:300,visible:true})
    // slider.setPosition(300,500)
    // slider.addOnChangeListener(function () {
    //     setScaleAngle(this.getValue())
    // })

    const winText = game.createElement({level:10}).createText("",{font:"100px arial",color:"green"})

    function winCondition() {
        if (leftBucketValue > rightBucketValue) {
            return
        }
        if (leftBucketValue === rightBucketValue) {
            // win
            winText.text = "YOU WIN!"
            winText.color = "green"
        } else if (leftBucketValue < rightBucketValue) {
            // lose
            winText.text = "YOU LOSE!"
            winText.color = "red"
        }
        numberCards.forEach(card=>{
            card.draggable = false
        })
    }

    const numberCards = []

    for (let i = 1; i < 10; i++) {
        const numberCard = game.createElement({draggable:true})
        numberCards.push(numberCard)
        numberCard.setPosition(50+i*50,550)
        numberCard.createShape("rectangle",{width:30,height:30,fill:"tan",stroke:"black"})
        numberCard.createText(`${i}`)
        numberCard.addOnFinishDraggingListener(function () {
            const leftBorder = rightBucket.center.x-35
            const topBorder = rightBucket.center.y+120
            const cardCenter = this.center

            if (cardCenter.xWithin(leftBorder,leftBorder+70) && cardCenter.yWithin(topBorder,topBorder+30)) {
                this.setPosition(this.center.x,rightBucket.center.y+135)
                rightBucket.addElement(this)
                rightBucketValue += i
                setScaleAngle((((leftBucketValue+rightBucketValue)/2)/leftBucketValue)-0.5)

                winCondition()
            } else {
                this.setPosition(50+i*50,550)
            }
        })
    }

    function resetGame(num) {
        // set left bucket
        cardOnScale.getChildByName("text").text = ""+ num
        leftBucketValue = num
        // clear right bucket
        rightBucket.reset()
        rightBucket.addElement(rightBucketShape)
        rightBucketValue = 0
        // return cards to og positions
        for (const card of numberCards) {
            card.setPosition(0,0)
            card.draggable = true
            card.finishDragging()
        }
        // set original angle
        setScaleAngle(0)
        // clear win text
        winText.text = ""
    }

    const againButton = game.createButton({text:"TRY AGAIN",color:"yellow"})
    againButton.setPosition(100,450)
    againButton.addOnButtonPressListener(function () {resetGame(leftBucketValue)})

    const newGameButton = game.createButton({text:"NEW GAME",color:"green"})
    newGameButton.setPosition(500,450)
    newGameButton.addOnButtonPressListener(function () {resetGame(Math.floor(Math.random()*20+5))})
}
scalesGame()