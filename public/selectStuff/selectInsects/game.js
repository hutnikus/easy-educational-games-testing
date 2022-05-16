// working code
import {Game, shuffleArray} from "/modules/index.js"
// code completion
// import * as G from "../../easy-educational-games/public/modules/index.js"

const canvas = document.getElementById('game');
canvas.width = 960;
canvas.height = 540;

const game = new Game(canvas);

////////////////////////////////////////////////////////////

function createBackgroundElement() {
    const backgroundElement = game.createElement()
    backgroundElement.createShape("rectangle", {width:canvas.width,height:canvas.height,fill:"green"})
    return backgroundElement
}

function createSelectionAreaElement() {
    const selectionAreaElement = game.createElement()
    selectionAreaElement.createShape("rectangle",{width:500,height:250,stroke:"black",fill:"#ded"})
    selectionAreaElement.createShape("rectangle",{dy:-110,width:500,height:30,fill:"#1c1"})
    return selectionAreaElement
}

function createConditionText() {
    return selectionAreaElement.createText("",{dy:-110,font:"20px Comic Sans MS"})
}

function createSubmitButton() {
    const submitText = (language === "sk")? "hotovo" : "submit"
    const submitButton = game.createButton({text:submitText,width:50,height:30,action:submitSolution,level:Number.POSITIVE_INFINITY})
    submitButton.setPosition(canvas.width/2 + 225,canvas.height/2 - 110)
    submitButton.textDrawable.font = "15px Comic Sans MS"
    return submitButton
}

function submitSolution() {
    const selected = getSelectedElementNames()
    const required = currentCondition.elements

    //je nieco oznacene?
    if (selected.length === 0) {
        const text = (language === "sk") ?
            "Nič si neoznačil" :
            "You didn't select anything..."
        alert(text)
        return
    }

    //je tam nieco naviac?
    for (const selName of selected) {
        if (!required.includes(selName)) {
            incorrectAudio.currentTime = 0
            incorrectAudio.play()
            const text = (language === "sk") ?
                "Máš tam nesprávny obrázok!" :
                "There is a wrong image selected!"
            alert(text)
            return
        }
    }
    //su tam vsetky?
    for (const reqName of required) {
        if (!selected.includes(reqName)) {
            const text = (language === "sk") ?
                "Skoro dobre, ešte ti tam niečo chýba!" :
                "Good going, but you're missing something!"
            alert(text)
            return
        }
    }
    correctAudio.currentTime = 0
    correctAudio.play()
    const text = (language === "sk") ?
        "Pekne! :)" :
        "Very nice! :)"
    alert(text)
    loadRandomNewCondition()
}

function loadCondition(number) {
    elementArray.forEach(element => element.home())

    currentCondition = conditions[number]
    conditionText.text = currentCondition.question
}

function createElementArray (nameArray) {
    const positionArray = createPostitionArray()
    const retval = []
    for (const i in nameArray) {
        const element = game.createElement({draggable:true,name:nameArray[i],clickable:true,x:positionArray[i][0],y:positionArray[i][1]})
        element.createImage(nameArray[i] + ".png")
        retval.push(element)

        element.addOnFinishDraggingListener(onFinishDragging)
        element.addOnClickListener(function () {
            const maxLevel = Math.max(...elementArray.map(el=>el.level))+1
            if (this.level < maxLevel) {
                game.changeLevelOfElement(this,maxLevel+1)
            }

        })
    }
    return shuffleArray(retval)
}

function createPostitionArray() {
    const positions = []
    for (let i = 0; i < 4; i++) {
        positions.push([192*(i+1),71])
    }
    positions.push([115,260])
    positions.push([845,260])
    for (let i = 0; i < 4; i++) {
        positions.push([192*(i+1),467])
    }
    return positions
}

function isInsideArea(element) {
    return selectionAreaElement.isInside(element.center)
}

function onFinishDragging() {
    if (!isInsideArea(this,selectionAreaElement)) {
        this.home()
    }
}

function getSelectedElementNames() {
    const names = []
    for (const element of elementArray) {
        if (isInsideArea(element)) {
            names.push(element.name)
        }
    }
    return names
}

function loadRandomNewCondition() {
    if (unplayedConditions.length === 0) {
        alert("You finished the game, but you can play again!")
        unplayedConditions = [...conditions.keys()]
    }

    const unplayedIndex = Math.floor(Math.random()*unplayedConditions.length)
    const conditionNumber = unplayedConditions[unplayedIndex]
    unplayedConditions.splice(unplayedIndex,1)

    loadCondition(conditionNumber)
}

/////////////////////////////////////////////////////////////

const insects = [
    "mucha", "motyl", "vcela", "cvrcek", "lucny_konik", "mravec", "komar", "vazka", "osa", "lienka"
]

const conditions = [
    {
        get question() {
            if (language === "sk") {
                return "Ktorý hmyz má žihadlo?"
            }
            return "Which insect has a stinger?"
        },
        elements: ["vcela","osa"]
    },
    {
        get question() {
            if (language === "sk") {
                return "Ktorý hmyz robí zvuk?"
            }
            return "Which insect makes a noise?"
        },
        elements: ["osa","vcela","mucha","cvrcek","lucny_konik","komar"]
    },
    {
        get question() {
            if (language === "sk") {
                return "Ktorý hmyz žije v komunite?"
            }
            return "Which insect lives in a community?"
        },
        elements: ["vcela", "mravec", "osa"]
    },
    {
        get question() {
            if (language === "sk") {
                return "Ktorý hmyz žije blízko vody?"
            }
            return "Which insect lives close to water?"
        },
        elements: ["komar", "vazka"]
    },
    {
        get question() {
            if (language === "sk") {
                return "Ktorý hmyz je otravný alebo nebezpečný?"
            }
            return "Which insect is annoying or dangerous?"
        },
        elements: ["mucha", "komar", "osa"]
    }
]

let language = "sk"

let currentCondition = undefined
const backgroundElement = createBackgroundElement()
const selectionAreaElement = createSelectionAreaElement()
const conditionText = createConditionText()
const submitButton = createSubmitButton()
const elementArray = createElementArray(insects)
let unplayedConditions = [...conditions.keys()]
const correctAudio = new Audio("/resources/win2.mp3")
const incorrectAudio = new Audio("/resources/lose2.mp3")

loadRandomNewCondition()

game.addOnMouseDownListener(function (event) {
    if (event.buttons === 4) {
        game.screenShot()
    }
})