// working code
import * as G from "/modules/index.js"
// code completion
// import * as G from "../../easy-educational-games/public/modules/index.js"

const canvas = document.getElementById('game');
canvas.width = 960;
canvas.height = 540;

const game = new G.Game(canvas);

const backgroundElement = game.createElement()
backgroundElement.createShape("rectangle", {width:canvas.width,height:canvas.height,fill:"green"})

const selectionAreaElement = game.createElement()
selectionAreaElement.createShape("rectangle",{width:500,height:250,stroke:"black",fill:"#ded"})
selectionAreaElement.createShape("rectangle",{dy:-110,width:500,height:30,fill:"#1c1"})
const conditionText = selectionAreaElement.createText("Which insect has a stinger?",{dy:-110,font:"20px Comic Sans MS"})

const submitButton = game.createButton({text:"submit",width:50,height:30,action:submitSolution,level:Number.POSITIVE_INFINITY})
submitButton.setPosition(canvas.width/2 + 225,canvas.height/2 - 110)
submitButton.textDrawable.font = "15px Comic Sans MS"

const insects = [
    "mucha", "motyl", "vcela", "cvrcek", "lucny_konik", "mravec", "komar", "vazka", "osa", "lienka"
]

const conditions = [
    {
        question: "Which insect has a stinger?",
        elements: ["vcela","osa"]
    },
    {
        question: "Which insect makes a noise?",
        elements: ["osa","vcela","mucha","cvrcek","lucny_konik","komar"]
    },
    {
        question: "Which insect lives in a community?",
        elements: ["vcela", "mravec", "osa"]
    },
    {
        question: "Which insect lives close to water?",
        elements: ["komar", "vazka"]
    },
    {
        question: "Which insect is annoying or dangerous?",
        elements: ["mucha", "komar", "osa"]
    }
]

function submitSolution() {
    const selected = getSelectedElementNames()
    const required = currentCondition.elements

    //je nieco oznacene?
    if (selected.length === 0) {
        alert("You didn't select anything...")
        return
    }

    //je tam nieco naviac?
    for (const selName of selected) {
        if (!required.includes(selName)) {
            incorrectAudio.currentTime = 0
            incorrectAudio.play()
            alert("There is a wrong image selected!")
            return
        }
    }
    //su tam vsetky?
    for (const reqName of required) {
        if (!selected.includes(reqName)) {
            alert("Good going, but you're missing something!")
            return
        }
    }
    correctAudio.currentTime = 0
    correctAudio.play()
    alert("Very nice! :)")
    loadRandomNewCondition()
}

let currentCondition = undefined

function loadCondition(number) {
    for (const i in elementArray) {
        setElementPosition(i,elementArray,positionArray)
    }

    currentCondition = conditions[number]
    conditionText.text = currentCondition.question
}

function shuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function createElementArray (nameArray) {
    const retval = []
    for (const name of nameArray) {
        const element = game.createElement({draggable:true,name:name,clickable:true})
        element.createImage(name + ".png")
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

function setElementPosition(index) {
    elementArray[index].setPosition(...positionArray[index])
}

function findElementPosition(element) {
    return elementArray.indexOf(element)
}

function isInsideArea(element) {
    return selectionAreaElement.isInside(element.center)
}

function onFinishDragging() {
    if (!isInsideArea(this,selectionAreaElement)) {
        const index = findElementPosition(this)
        setElementPosition(index, elementArray, positionArray)
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

const elementArray = createElementArray(insects)
const positionArray = createPostitionArray()
let unplayedConditions = [...conditions.keys()]
const correctAudio = new Audio("/resources/win2.mp3")
const incorrectAudio = new Audio("/resources/lose2.mp3")

loadRandomNewCondition()

