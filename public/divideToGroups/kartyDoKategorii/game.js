// working code
import {Game, randomLightColor, randomSelection} from "/modules/index.js"
// code completion
// import * as G from "../../easy-educational-games/public/modules/index.js"

const canvas = document.getElementById('game');
canvas.width = 960;
canvas.height = 540;

const game = new Game(canvas);

///////////////////////////////////////////////////////

function createCard(text,category) {
    const element = game.createElement({draggable:true,name:text})
    const textDrawable = element.createText(text)
    const textWidth = textDrawable.measureText(element.shared.tempContext).width
    const width = Math.floor(textWidth) + 15
    element.createShape("rectangle",{width:width,height:30,level:-1,name:"card",stroke:"black",fill:randomLightColor()})
    element.category = category

    return element
}

function createCardsFromCategory(category) {
    const w = canvas.width*0.75
    const h = canvas.height/4-40
    const result = []
    const length = Math.floor(Math.random()*(Math.min(entities.get(category).length - 2, 4)) + 2)
    const selection = randomSelection(entities.get(category),length)
    for (const el of selection) {
        const card = createCard(el, category)
        card.setPosition(
            (Math.random() * w) + 100,
            (Math.random() * h) + 20
        )
        result.push(card)
    }
    return result
}

function createCards(categories) {
    let result = []
    for (const category of categories) {
        result = result.concat(createCardsFromCategory(category))
    }
    return result
}

function createRegion(text, width, height) {
    const element = game.createElement({draggable:false,name:text})
    element.createShape("rectangle", {width:width, height:height, level:-1, name:"region", stroke:"black",fill:randomLightColor()})
    element.createText(text,{dy:-(height/2) + 20,font:"30px Arial"})

    return element
}

function createRegions(categories) {
    const height = Math.floor(canvas.height*0.75)
    const y = Math.floor(canvas.height/4+height/2)
    const result = new Map()
    const width = Math.floor(canvas.width / categories.length)
    let x = width/2
    for (const category of categories) {
        const region = createRegion(category, width, height)
        region.setPosition(x,y)
        x = x + width
        result.set(category, region)
    }
    return result
}

function insideCorrectRegion(element) {
    const region = regions.get(element.category)
    return region.isInside(element.center)
}

function submitSolution() {
    const outside = cards.filter(el => el.center.y < canvas.height-400+15)

    if (outside.length > 0){
        alert("Neumiestnil si všetky kartičky!")
        return
    }
    for (const card of cards){
        if (!insideCorrectRegion(card)){
            alert("Niektoré kartičky nie sú umiestnené správne!")
            return
        }
    }

    correctAudio.currentTime = 0
    correctAudio.play()
    alert("Skvele :)")

    resetGame()
}

function resetGame() {
    game.clear()

    const submitButton = game.createButton({text:"hotovo",width:80,height:40,action:submitSolution,level:Number.POSITIVE_INFINITY})
    submitButton.setPosition(canvas.width-45,25)
    submitButton.textDrawable.font = "24px Comic Sans MS"

    //vytber nahodne 4 zo 7 kategorii
    const categories = randomSelection(allCategories,4)
    //vytvor oblasti a karticky
    regions = createRegions(categories)
    cards = createCards(categories)
}

///////////////////////////////////////////////////////

const allCategories = ['mestá','rieky','nádrže','pohoria','vrchy','hrady','nížiny'];

const entities = new Map([
    ['mestá', ['Bratislava', 'Košice', 'Žilina', 'Trenčín', 'Prešov', 'Poprad', 'Trnava', 'Banská Bystrica', 'Piešťany', 'Liptovský Mikuláš']],
    ['rieky', ['Dunaj', 'Váh', 'Hron', 'Hornád', 'Ipeľ', 'Morava', 'Dunajec', 'Torysa']],
    ['nádrže', ['Oravská priehrada', 'Domaša', 'Liptovská Mara', 'Zemplínska Šírava', 'Vodné dielo Gabčíkovo']],
    ['pohoria', ['Vysoké Tatry', 'Nízky Tatry', 'Malá Fatra', 'Veľká Fatra', 'Malé Karpaty', 'Strážovské vrchy', 'Tribeč', 'Vtáčnik', 'Biele Karpaty', 'Štiavnické vrchy', 'Kremnické vrchy', 'Slovenské rudohorie', 'Slanské vrchy', 'Nízke Beskydy']],
    ['vrchy', ['Chopok', 'Ďumbier', 'Kriváň', 'Gerlachovský štít', 'Lomnický štít', 'Sitno']],
    ['hrady', ['Beckov', 'Devín', 'Trenčiansky hrad', 'Bratislavský hrad', 'Bojnický zámok', 'Nitriansky hrad', 'Levický hrad', 'Považský hrad', 'Oravský hrad', 'Bzovík', 'Červený kameň', 'Zvolenský zámok', 'Spišský hrad']],
    ['nížiny',['Záhorská nížina', 'Podunajská nížina', 'Východoslovenská nížina']]
])

let regions = new Map()
let cards = []
const correctAudio = new Audio("/resources/win1.mp3")

resetGame()