// working code
import {Game, shuffleArray} from "/modules/index.js"
// code completion
// import * as G from "../../easy-educational-games/public/modules/index.js"

const canvas = document.getElementById('game');
canvas.width = 960;
canvas.height = 540;

const game = new Game(canvas);

////////////////////////////////////////////////////

function createPanel() {
    const panel = game.createElement()
    panel.createShape("rectangle",{
        width:canvas.width,
        height:PANEL_HEIGHT,
        fill:"#ECB804"
    })
    panel.setPosition(canvas.width/2,PANEL_HEIGHT/2)
    return panel
}

function createSolveButton() {
    const button = game.createButton({
        text:solveText,
        height:PANEL_HEIGHT-SPACING*2,
        width:SB_WIDTH,
        level:Number.POSITIVE_INFINITY,
        action:solve,
    })
    button.textDrawable.font = "15px arial"
    button.setPosition(canvas.width-SB_WIDTH/2-SPACING,PANEL_HEIGHT/2)

    return button
}

function createNewGameButton() {
    const button = game.createButton({
        text:newGameText,
        height:PANEL_HEIGHT-SPACING*2,
        width:NGB_WIDTH,
        level:Number.POSITIVE_INFINITY,
        action:loadRandomSetting,
    })
    button.textDrawable.font = "15px arial"
    button.setPosition(canvas.width-SB_WIDTH-NGB_WIDTH/2-SPACING*3,PANEL_HEIGHT/2)

    return button
}

function getSliderValue() {
    return slider.getValue()
}

function onSliderChange() {
    const value = getSliderValue()

    sliderText.getChildByName("text").text = `${quantityText}: ${value}`
}

function createSlider() {
    const slider = game.createRangeSlider({
        width:SLIDER_WIDTH,
        level:Number.POSITIVE_INFINITY,
        min: MIN_SLIDER,
        max: MAX_SLIDER
    })
    slider.setPosition(
        canvas.width-SB_WIDTH-NGB_WIDTH-SLIDER_WIDTH/2-SPACING*5,
        PANEL_HEIGHT/4
    )
    slider.setValue(MIN_SLIDER,false)
    slider.addOnChangeListener(onSliderChange)

    return slider
}

function createSliderText() {
    const element = game.createElement({level:Number.POSITIVE_INFINITY})
    element.createText(`${quantityText}: 4`,{font:"15px arial",name:"text"})

    element.setPosition(
        canvas.width-SB_WIDTH-NGB_WIDTH-SLIDER_WIDTH/2-SPACING*5,
        PANEL_HEIGHT*(3/4)
    )

    return element
}

function createHeaderText() {
    const maxWidth = canvas.width-SB_WIDTH-NGB_WIDTH-SLIDER_WIDTH-SPACING*6
    const element = game.createElement({level:Number.POSITIVE_INFINITY})
    element.createText("SAMPLE TEXT",{font:"30px Comic Sans MS",maxWidth:maxWidth,name:"text",})

    element.setPosition(
        (maxWidth)/2,
        PANEL_HEIGHT/2
    )

    return element
}

function changeHeaderText(text) {
    const textDrawable = headerText.getChildByName("text")
    textDrawable.text = text
}

function createSortOrderImage() {
    const element = game.createElement({level:Number.POSITIVE_INFINITY})
    element.createImage("sortOrder.png",{name:"img"})
    element.setPosition(canvas.width-25,PANEL_HEIGHT+25)
    return element
}

function setSortOrder(order) {
    const img = sortOrderImg.getChildByName("img")
    if (order === "hAsc") {
        img.rotation = 0
        img.hScale = 1
        changeHeaderText(headerTextAsc)
    } else if (order === "hDesc") {
        img.rotation = 0
        img.hScale = -1
        changeHeaderText(headerTextDesc)
    } else if (order === "vAsc") {
        img.rotation = Math.PI/2
        img.hScale = 1
        changeHeaderText(headerTextAsc)
    } else if (order === "vDesc") {
        img.rotation = -Math.PI/2
        img.hScale = -1
        changeHeaderText(headerTextDesc)
    } else {
        throw new Error("Incorrect order!")
    }
}

function setCurrentOrder() {
    setSortOrder(currentOrdering)
}

function createBuildingElements(qty,images) {
    const array = []
    const buildingWidth = 100
    const spaces = canvas.width/qty
    const minHeight = 200
    const maxHeight = canvas.height-PANEL_HEIGHT-50
    const heightStep = (maxHeight-minHeight)/qty

    for (let i = 0; i < qty; i++) {
        const element = game.createElement({draggable:true,clickable:true})
        const imgName = images[Math.floor(Math.random()*images.length)] + ".png"
        element.createImage(imgName,{width:buildingWidth,height:minHeight+i*heightStep,name:`img`})
        element.addOnClickListener(function () {
            const maxLevel = Math.max(...displayedElements.map(el=>el.level))
            game.changeLevelOfElement(this,maxLevel+1)
        })
        array.push(element)
    }
    const shuffled = shuffleArray(array)
    for (const i in shuffled) {
        const img = shuffled[i].getChildByName("img")
        shuffled[i].setPosition(
            i*spaces+spaces/2,
            canvas.height-img.height/2-5
        )
    }
    return array
}

function createHlineElements(qty) {
    const array = []
    const lineWidth = 10
    const spaces = (canvas.height-PANEL_HEIGHT)/qty
    const minWidth = 200
    const maxWidth = canvas.width-50
    const widthStep = (maxWidth-minWidth)/qty

    for (let i = 0; i < qty; i++) {
        const element = game.createElement({draggable:true,clickable:true})
        element.createShape("line",{coords:[0,0,minWidth+i*widthStep,0],name:`img`,width:minWidth+i*widthStep,lineWidth:lineWidth,stroke:"black"})
        element.createShape("line",{coords:[0,0,minWidth+i*widthStep,0],lineWidth:1,stroke:"red"})
        element.addOnClickListener(function () {
            const maxLevel = Math.max(...displayedElements.map(el=>el.level))
            game.changeLevelOfElement(this,maxLevel+1)
        })
        array.push(element)
    }
    const shuffled = shuffleArray(array)
    for (const i in shuffled) {
        const img = shuffled[i].getChildByName("img")
        shuffled[i].setPosition(
            5,
            PANEL_HEIGHT + i*spaces+spaces/2,
        )
    }
    return array
}

function clearArea() {
    game.removeElements(...displayedElements)
}

function loadSetting(setting) {
    const qty = getSliderValue()
    if (setting.maxNum < qty || qty < setting.minNum) {
        throw new RangeError(`This setting doesn't support quantity of ${qty}`)
    }
    clearArea()
    const order = setting.ordering[Math.floor(Math.random()*2)]
    currentOrdering = order
    setSortOrder(order)
    displayedElements = setting.callback(qty,setting.images)
}

function loadRandomSetting() {
    const qty = getSliderValue()
    const filtered = settings.filter(s=>(s.minNum <= qty && qty <= s.maxNum))
    if (filtered.length === 0) {
        throw new Error("No setting matches conditions!")
    }
    loadSetting(filtered[Math.floor(Math.random()*filtered.length)])
}

function checkCorrect() {
    let sortedByPosition
    let relevantSize
    if (currentOrdering.startsWith("h")) {
        sortedByPosition = [...displayedElements].sort((a, b) => b.center.x-a.center.x)
        relevantSize = "h"
    } else if (currentOrdering.startsWith("v")) {
        sortedByPosition = [...displayedElements].sort((a, b) => b.center.y-a.center.y)
        relevantSize = "w"
    } else {
        throw new Error(`Incorrect ordering value: ${currentOrdering}`)
    }
    const sortedBySize = [...displayedElements].sort((a, b) => {
        let aSize
        let bSize
        if (relevantSize === "w") {
            aSize = a.getChildByName("img").width
            bSize = b.getChildByName("img").width
        } else {
            aSize = a.getChildByName("img").height
            bSize = b.getChildByName("img").height
        }
        if (currentOrdering.endsWith("Asc")) {
            return bSize-aSize
        }
        if (currentOrdering.endsWith("Desc")) {
            return aSize-bSize
        }
        throw new Error(`Incorrect ordering value: ${currentOrdering}`)
    })

    for (const i in displayedElements) {
        if (relevantSize === "h") {
            if (sortedBySize[i].getChildByName("img").height !== sortedByPosition[i].getChildByName("img").height) {
                return false
            }
        }
        else if (relevantSize === "w") {
            if (sortedBySize[i].getChildByName("img").width !== sortedByPosition[i].getChildByName("img").width) {
                return false
            }
        }
    }
    return true
}

function correctSolution() {
    correctAudio.currentTime = 0
    correctAudio.play()
    changeHeaderText(correctMsg[Math.floor(Math.random()*correctMsg.length)])
    timeout = setTimeout(setCurrentOrder,3000)
}

function incorrectSolution() {
    incorrectAudio.currentTime = 0
    incorrectAudio.play()
    changeHeaderText(incorrectMsg[Math.floor(Math.random()*incorrectMsg.length)])
    timeout = setTimeout(setCurrentOrder,3000)
}

function solve() {
    clearTimeout(timeout)
    if (checkCorrect()) {
        correctSolution()
    } else {
        incorrectSolution()
    }
}

function setLanguage(lang) {
    if (lang === "sk") {
        correctMsg = ["Úžasné!","Správne!","Zoraďovanie ti ide!","Dobrá práca!"]
        incorrectMsg = ["Nemáš to správne, skús znova!","Niečo je uložené nesprávne, skús to nájsť!","Nesprávne!"]

        headerTextAsc = "Zoraď obrázky od najmenšieho po najväčší!"
        headerTextDesc = "Zoraď obrázky od najväčšieho po najmenší!"

        quantityText = "Počet"
        newGameText = "Nová Hra"
        solveText = "Vyriešené"
    } else if (lang === "en") {
        correctMsg = ["Awesome!","Amazing!","You're really good at sorting!","Nice job!"]
        incorrectMsg = ["It's not correct, try again!","Something's placed wrong, try to find it!","Incorrect!"]

        headerTextAsc = "Order the images from smallest to biggest!"
        headerTextDesc = "Order the images from biggest to smallest!"

        quantityText = "Quantity"
        newGameText = "New Game"
        solveText = "Solved"
    }
}

////////////////////////////////////////////////////

const PANEL_HEIGHT = 40
const SPACING = 5
const SB_WIDTH = 70
const NGB_WIDTH = 80
const SLIDER_WIDTH = 150
const MIN_SLIDER = 4
const MAX_SLIDER = 10

// requirements for callbacks:
// parameters (quantity,images)
// each element of returned array has to have a child with name "img" with set width or height (horizontal/vertical sorting)
const settings = [
    {
        ordering:["hAsc","hDesc"],
        minNum:MIN_SLIDER,
        maxNum:9,
        callback:createBuildingElements,
        images:["skyscraper"],
    },
    {
        ordering:["vAsc","vDesc"],
        minNum:MIN_SLIDER,
        maxNum:MAX_SLIDER,
        callback:createHlineElements,
        images:undefined,
    }
]
let correctMsg,incorrectMsg,headerTextAsc,headerTextDesc,quantityText,newGameText, solveText

setLanguage("sk")

const panel = createPanel()
const headerText = createHeaderText()
const slider = createSlider()
const sliderText = createSliderText()
const newGameButton = createNewGameButton()
const solveButton = createSolveButton()
const sortOrderImg = createSortOrderImage()
const correctAudio = new Audio("/resources/win1.mp3")
const incorrectAudio = new Audio("/resources/lose2.mp3")

let displayedElements = []
let currentOrdering = undefined
let timeout = undefined

loadRandomSetting()

game.addOnMouseDownListener(function (event) {
    if (event.buttons === 4) {
        game.screenShot()
    }
})