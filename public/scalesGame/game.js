// working code
import {Game, Point} from "../modules/index.js"
// code completion
// import * as G from "../../easy-educational-games/public/modules/index.js"

const canvas = document.getElementById('game');
canvas.width = 600;
canvas.height = 600;

const game = new Game(canvas);

/////////////////////////////////////////////////////////////

function createScaleBase() {
    const scaleBase = game.createElement()
    scaleBase.setPosition(300,100)
    scaleBase.createShape("line", {coords:[0,0,0,300],stroke:"black"})
    scaleBase.createShape("line", {coords:[-50,300,50,300],stroke:"black"})
    return scaleBase
}

function createScaleArm() {
    const scaleArm = game.createElement()
    scaleArm.setPosition(...scaleBase.center.asArray())
    scaleArm.createShape("line", {coords:[-200,0,200,0],stroke:"black"})
    return scaleArm
}

function createLeftBucketShape() {
    const leftBucketShape = game.createElement()
    leftBucketShape.setPosition(...scaleBase.center.subtract(new Point(200,0)).asArray())
    leftBucketShape.createShape("line", {coords:[0,0,0,50,-50,150,50,150,0,50],stroke:"black"})
    return leftBucketShape
}

function createRightBucketShape() {
    const rightBucketShape = game.copyElement(leftBucketShape)
    rightBucketShape.setPosition(...scaleBase.center.add(new Point(200,0)).asArray())
    return rightBucketShape
}

function createCardOnScale() {
    const cardOnScale = game.createElement()
    cardOnScale.setPosition(...leftBucketShape.center.add(new Point(0,135)).asArray())
    cardOnScale.createShape("rectangle",{width:30,height:30,fill:"tan",stroke:"black"})
    cardOnScale.createText("15",{name:"text"})
    return cardOnScale
}

function createLeftBucketComposite() {
    const leftBucket = game.createComposite()
    leftBucket.setPosition(...leftBucketShape.center.asArray())
    leftBucket.addElements(leftBucketShape,cardOnScale)
    return leftBucket
}

function createRightBucketComposite() {
    const rightBucket = game.createComposite()
    rightBucket.setPosition(...rightBucketShape.center.asArray())
    rightBucket.addElements(rightBucketShape)
    return rightBucket
}

function createBucketsComposite() {
    const buckets = game.createComposite()
    buckets.addElements(leftBucket,rightBucket)
    return buckets
}

function setScaleAngle(percent) {
    const angle0 = -0.4
    const angle = (angle0*-2 * percent) + angle0
    scaleArm.rotation = angle
    buckets.rotateElements(scaleBase.center,-currentRotation,true)
    buckets.rotateElements(scaleBase.center,angle,true)
    currentRotation = angle
}

function winCondition() {
    if (leftBucketValue > rightBucketValue) {
        return
    }
    if (leftBucketValue === rightBucketValue) {
        // win
        winAudio.currentTime = 0
        winAudio.play()
        winText.text = "SPRÁVNE!"
        winText.color = "green"
    } else if (leftBucketValue < rightBucketValue) {
        // lose
        loseAudio.currentTime = 0
        loseAudio.play()
        winText.text = "NESPRÁVNE!"
        winText.color = "red"
    }
    numberCards.forEach(card=>{
        card.draggable = false
    })
}

function createNumberCards() {
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
    return numberCards
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

function createAgainButton() {
    const againButton = game.createButton({text:"ZNOVA",color:"yellow"})
    againButton.setPosition(100,450)
    againButton.addOnButtonPressListener(function () {resetGame(leftBucketValue)})
    return againButton
}

function createNewGameButton() {
    const newGameButton = game.createButton({text:"NOVÁ HRA",color:"green"})
    newGameButton.setPosition(500,450)
    newGameButton.addOnButtonPressListener(function () {resetGame(Math.floor(Math.random()*20+5))})
    return newGameButton
}

function createAngleTestingSlider() {
    const slider = game.createRangeSlider({width:300,visible:true,min:0,max:1,floating:true})
    slider.setPosition(300,500)
    slider.addOnChangeListener(function () {
        setScaleAngle(this.getValue())
    })
    return slider
}

/////////////////////////////////////////////////////////////

const scaleBase = createScaleBase()
const scaleArm = createScaleArm()
const leftBucketShape = createLeftBucketShape()
const rightBucketShape = createRightBucketShape()
const cardOnScale = createCardOnScale()
const leftBucket = createLeftBucketComposite()
const rightBucket = createRightBucketComposite()
const buckets = createBucketsComposite()

let currentRotation = 0
let leftBucketValue = 15
let rightBucketValue = 0
//
setScaleAngle(0)

const winText = game.createElement({level:10}).createText("",{font:"100px arial",color:"green", maxWidth:550})

const winAudio = new Audio("/resources/win2.mp3")
const loseAudio = new Audio("/resources/lose3.mp3")

const numberCards = createNumberCards()
const againButton = createAgainButton()
const newGameButton = createNewGameButton()
//
// // const slider = createAngleTestingSlider()
//
// game.addOnMouseDownListener(function (event) {
//     if (event.buttons === 4) {
//         game.screenShot()
//     }
// })