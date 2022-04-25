// working code
import {Game, randomSelection} from "/modules/index.js"
// code completion
// import * as G from "../../easy-educational-games/public/modules/index.js"

const canvas = document.getElementById('game');
canvas.width = 960;
canvas.height = 540;

const game = new Game(canvas);

///////////////////////////////////////////////////////////////

function createLetter(letter, i){
    const imageName = IMG_NAME + Math.floor(Math.random()*IMG_NUMBER+1) + ".png"
    const element = game.createElement({draggable:true,name:"lett"+i})
    element.createImage(imageName,{name:"image",width:50,height:50})
    element.createText(letter,{name:"text",color:TEXT_COLOR})
    element.setPosition(
        (Math.random() * (canvas.width - 100)) + 50,
        (Math.random() * (canvas.height - 100)) + 50
    )
    element.addHitbox(25)
    element.letter = letter
    return element
}

function createWord(word,letter){
    const element = game.createElement({draggable:true,name:"word_"+word})
    const textDrawable = element.createText(word, {name:"text"})
    const textWidth = textDrawable.measureText(element.shared.tempContext).width
    const width = Math.floor(textWidth) + 15
    element.createShape("rectangle", {width:width,height:30, level:-1, name:"card", fill:"white",stroke:"black"})
    element.setPosition(
        (Math.random() * (canvas.width - 100)) + 50,
        (Math.random() * (canvas.height - 100)) + 50
    )
    element.addHitbox(25)
    element.letter = letter
    return element
}

function createAllElements(number){
    const pairs = randomSelection(allPairs, number)
    const letters = []
    const words = []

    for (let i=0; i<pairs.length; i++) {
        words.push(createWord(pairs[i][0], pairs[i][1]))
        letters.push(createLetter(pairs[i][1],i))
    }
    game.moveToTopWhenDragging([...words,...letters])
    return {
        letters: letters,
        words:words,
        solved: []
    }
}

function mergeElements(e1,e2) {
    let letter,word
    try {
        e1.getChildByName("card")
        word = e1
        letter = e2
    } catch (e) {
        letter = e1
        word = e2
    }

    const index = task.words.indexOf(word);
    if (index > -1) {
        task.words.splice(index, 1);
    }
    letter.letter = '_'

    task.solved.push(word)

    let text = word.getChildByName("text").text
    word.getChildByName("text").text = text.replace("_", word.letter)
    letter.getChildByName("image").width = 100
    letter.getChildByName("image").height = 100
    letter.popChildByName("text")
    word.setPosition(
        letter.center.x,
        letter.center.y
    )

    // manual merge instead of composite
    game.changeLevelOfElement(letter,-1)
    const cardDrawable = word.getChildByName("card")
    cardDrawable.level = 1
    letter.addChild(cardDrawable)
    const textDrawable = word.getChildByName("text")
    textDrawable.level = 2
    letter.addChild(textDrawable)
    word.visible = false
}

function checkCollisionsWith(elem) {
    const collisions = game.checkCollisions(elem)
    console.log(collisions.length)
    if (collisions.length === 0) {
        return -1
    }
    const correctCollisions = collisions.filter(el => el.name[0] !== elem.name[0]  && el.letter === elem.letter)
    if (correctCollisions.length === 0) {
        return 0
    }
    mergeElements(elem,correctCollisions[0])
    return 1
}

function hideFeedback(){
    okSign.visible = false
    koSign.visible = false
}

function correctSolution() {
    correctAudio.currentTime = 0
    correctAudio.play()
    okSign.visible = true
    timeout = setTimeout(hideFeedback,3000)
}

function incorrectSolution() {
    incorrectAudio.currentTime = 0
    incorrectAudio.play()
    koSign.visible = true
    timeout = setTimeout(hideFeedback,3000)
}

function checkSolution() {
    if (0 === task.words.length)
        return
    let ok = 1
    for (const item of [...task.words]) {
        ok = Math.min(ok,checkCollisionsWith(item))
    }

    if (ok === -1)
        alert("Niektoré písmenká nie sú doplnené! ")
    else if (ok === 0)
        incorrectSolution()
    else
        correctSolution()
}

function newGame(){
    game.removeElements(...task.letters)
    game.removeElements(...task.words)
    game.removeElements(...task.solved)
    hideFeedback()
    task = createAllElements(NUMBER)
}

function createCheckButton() {
    const button = game.createButton({
        text:"Hotovo",
        height:PANEL_HEIGHT-SPACING*2,
        width:SB_WIDTH,
        level:Number.POSITIVE_INFINITY,
        action:checkSolution,
    })
    button.textDrawable.font = "15px arial"
    button.setPosition(canvas.width-SB_WIDTH/2-SPACING,PANEL_HEIGHT/2)

    return button
}

function createNewGameButton() {
    const button = game.createButton({
        text:"Nová hra",
        height:PANEL_HEIGHT-SPACING*2,
        width:NGB_WIDTH,
        level:Number.POSITIVE_INFINITY,
        action:newGame,
    })
    button.textDrawable.font = "15px arial"
    button.setPosition(canvas.width-SB_WIDTH-NGB_WIDTH/2-SPACING*3,PANEL_HEIGHT/2)

    return button
}

function createOKFeedback() {
    const element = game.createElement({name:"ok", visible:false})
    element.createImage("ok.png")
    element.setPosition(canvas.width-SB_WIDTH/2-SPACING,3*PANEL_HEIGHT/2)

    return element
}

function createKOFeedback() {
    const element = game.createElement({name:"ko", visible:false})
    element.createImage("ko.png")
    element.setPosition(canvas.width-SB_WIDTH/2-SPACING,3*PANEL_HEIGHT/2)

    return element
}

////////////////////////////////////////////////////

const allPairs = [
    ['l_že', 'y'], ['k_vadlo', 'y'], ['ch_ba', 'y'], ['g_mnastika', 'y'], ['malin_', 'y'], ['l_žica','y'], ['poh_b','y'], ['odd_ch','y'], ['h_mna','y'], ['t_č','y'], ['ml_n','y'], ['d_m','y'], ['brosk_ňa','y'], ['k_slý','y'], ['k_slík','y'], ['g_mnázium','y'], ['pl_n','y'], ['dot_k','y'], ['ruk_','y'], ['d_ňa','y'], ['ch_tať','y'], ['k_tica','y'], ['ch_trý','y'], ['t_kadlo','y'], ['noh_','y'],
    ['uš_ť', 'i'], ['poc_t', 'i'], ['koč_š', 'i'], ['ž_ť', 'i'], ['ž_vot', 'i'], ['oč_', 'i'], ['uč_teľ', 'i'], ['š_roký', 'i'], ['c_rkus', 'i'], ['č_n', 'i'], ['ž_hadlo', 'i'], ['tuš_ť', 'i'], ['š_mpanz', 'i'], ['väčš_na', 'i'], ['č_stý', 'i'], ['c_buľa', 'i'], ['c_nkať', 'i'], ['slovenč_na', 'i'], ['kaz_ť', 'i'], ['stlač_ť', 'i'], ['š_kovný', 'i'], ['c_trón', 'i'], ['š_ška', 'i'], ['c_sár', 'i'], ['stráž_ť', 'i'], ['uš_', 'i'],
    ['stoj_','í'], ['zauj_mavý','í'], ['bež_','í'], ['č_tať','í'], ['č_slo','í'], ['š_pka','í'], ['c_tiť','í'], ['dž_nsy','í'], ['koš_k','í'], ['nož_k','í'], ['čuš_','í'],
    ['ch_bať', 'ý'], ['k_chať', 'ý'], ['ch_r', 'ý'], ['h_bať', 'ý'], ['d_chať', 'ý'], ['zl_', 'ý'], ['t_ždeň', 'ý'], ['d_ka', 'ý'], ['pekn_', 'ý'], ['l_tko', 'ý']
]

const PANEL_HEIGHT = 40
const SPACING = 5
const SB_WIDTH = 70
const NGB_WIDTH = 80
const IMG_NAME = "ozdoba"
const IMG_NUMBER = 12
const TEXT_COLOR = "white"
const NUMBER = 10

const newGameButton = createNewGameButton()
const submitButton = createCheckButton()
const okSign = createOKFeedback()
const koSign = createKOFeedback()
const correctAudio = new Audio("/resources/win1.mp3")
const incorrectAudio = new Audio("/resources/lose2.mp3")

let task = {
    letters: [],
    words: [],
    solved: []
}
let timeout = undefined
newGame()

