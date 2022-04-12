// working code
import * as G from "/modules/index.js"
// code completion
// import * as G from "../../easy-educational-games/public/modules/index.js"

const canvas = document.getElementById('game');
canvas.width = 960;
canvas.height = 540;

const game = new G.Game(canvas);

///////////////////////////////////////////////

function createHeaderText(text) {
    const element = game.createElement()
    element.createText(text,{font:"30px arial",name:"text"})
    element.setPosition(canvas.width/2,20)
    return element
}

function createScoreCounter(max) {
    const spacing = 32
    const element = game.createElement()
    for (let i = 0; i < max; i++) {
        element.createText("☺", {font: "50px arial",dx:i*spacing,color:"lightgrey",name:`score${i}`})
    }
    element.setPosition(spacing*(3/4),canvas.height-spacing*(3/4))

    return element
}

function setScore(score,value) {
    if (score < 0 || score > MAX_SCORE) {
        throw new Error("Incorrect score setting")
    }
    scoreCounter.getChildByName(`score${score}`).color = (value)?"black":"lightgrey"
}

function createNextButton() {
    const spacing = 10
    const button = game.createButton({text:NEXT_TEXT,height:30})
    button.setPosition(canvas.width-button.width/2-spacing,canvas.height-button.height/2-spacing)
    return button
}

function createAllElements() {
    const array = []
    const names = new Set([].concat(...settings.map(s=>s.images)))

    for (const name of names) {
        const element = game.createElement({clickable:true,visible:false,name:name})
        element.createImage(name + ".png",{name:"img",width:IMAGE_SIZE,height:IMAGE_SIZE})
        element.addOnClickListener(onClickElement)
        array.push(element)
    }

    return array
}

function resetGame() {
    availableSettings = [...settings].sort((a,b)=>Math.random()-0.5)
    currentTask = 0

    for (let i = 0; i < MAX_SCORE; i++) {
        setScore(i,false)
    }

    loadTaskSetting()

    nextButton.text = NEXT_TEXT
    nextButton.removeOnButtonPressListener(onClickResetButton)
    nextButton.addOnButtonPressListener(onClickNextButton)
    nextButton.color = "green"
}

function setElementVisibility(setting) {
    const array = []
    elements.forEach(e=> {
        if (setting.images.includes(e.name)) {
            array.push(e)
            e.visible = true
        } else {
            e.visible = false
        }
    })
    return array.sort((a, b) => Math.random()-0.5)
}

function displayVisibleElements() {
    const length = visibleElements.length

    if (length < 5) {
        const spacing = canvas.width/length
        for (let i = 0; i < length; i++) {
            visibleElements[i].setPosition(
                i*spacing+spacing/2,
                canvas.height/2
            )
        }
    } else {
        const topNumber = Math.ceil(length/2)
        const topSpacing = canvas.width/topNumber
        for (let i = 0; i < topNumber; i++) {
            visibleElements[i].setPosition(
                i*topSpacing+topSpacing/2,
                canvas.height/3
            )
        }
        const bottomSpacing = canvas.width/(length-topNumber)
        for (let i = 0; i < (length-topNumber); i++) {
            visibleElements[i+topNumber].setPosition(
                i*bottomSpacing+bottomSpacing/2,
                canvas.height*(2/3)
            )
        }
    }
}

function loadTaskSetting() {
    const setting = availableSettings[currentTask]
    visibleElements = setElementVisibility(setting)
    displayVisibleElements()
}

function isCorrectImg(element) {
    const currentSetting = availableSettings[currentTask]
    return element.name === currentSetting.correct
}

function onCorrect() {
    setScore(currentTask,true)
    correctAudio.currentTime = 0
    correctAudio.play()
}

function onIncorrect() {
    incorrectAudio.currentTime = 0
    incorrectAudio.play()
}

function onClickElement() {
    if (isCorrectImg(this)) {
        onCorrect()
    } else {
        onIncorrect()
    }
}

function onClickNextButton() {
    currentTask++
    loadTaskSetting()

    if (currentTask+1 === MAX_SCORE) {
        this.removeOnButtonPressListener(onClickNextButton)
        this.addOnButtonPressListener(onClickResetButton)
        this.text = RESET_TEXT
        this.color = "yellow"
    }
}

function onClickResetButton() {
    resetGame()
}

///////////////////////////////////////////////

const settings = [
    {
        images: ["curling","tenis","krasokorculovanie","zjazd","slalom"],
        correct: "tenis"
    },
    {
        images: ["puk","hokej","lyziarske_palice","hokejka","hokejova_helma"],
        correct: "lyziarske_palice"
    },
    {
        images: ["sanky","lyze","korcule","boby","snowboardista"],
        correct: "korcule"
    },
    {
        images: ["damske_cizmy","tenisky","cizmy","rukavice"],
        correct: "rukavice"
    },
    {
        images: ["krasokorculovanie","curling","biatlon","hokej"],
        correct: "biatlon"
    },
    {
        images: ["vlocka","duha","snehuliak","cencul"],
        correct: "duha"
    },
    {
        images: ["rukavice","plavky","sal","bunda","cizmy"],
        correct: "plavky"
    },
    {
        images: ["korcule","lyziarske_palice","skokansky_most","slalom","lyze"],
        correct: "korcule"
    },
    {
        images: ["hokejova_helma","siltovka","capica","lyziarske_okuliare","tricko"],
        correct: "tricko"
    },
    {
        images: ["damske_cizmy","tenisky","cizmy","sal"],
        correct: "sal"
    },
    {
        images: ["hokejova_helma","siltovka","capica","lyziarske_okuliare","plavky"],
        correct: "plavky"
    },
    {
        images: ["krasokorculovanie","curling","zjazd","hokej"],
        correct: "zjazd"
    },
    {
        images: ["sanky","lyze","hokejka","boby","snowboardista"],
        correct: "hokejka"
    },
]
const MAX_SCORE = 9
const IMAGE_SIZE = 100
const NEXT_TEXT = "Next task"
const RESET_TEXT = "Play again"
const correctAudio = new Audio("/resources/win1.mp3")
const incorrectAudio = new Audio("/resources/lose2.mp3")

const headerText = createHeaderText("Choose image that doesn't belong.")
const scoreCounter = createScoreCounter(MAX_SCORE)
const nextButton = createNextButton()
const elements = createAllElements()

let visibleElements = undefined
let availableSettings = []
let currentTask = 0
resetGame()
