// working code
import {Game, Point, GameElement, GameShape, GameText, GameGif, GameImage, GameHitbox, randomInt, removeFromArray,randomSelection} from "/modules/index.js"
// code completion
// import * as G from "../../easy-educational-games/public/modules/index.js"

const canvas = document.getElementById('game');
canvas.width = 600;
canvas.height = 600;

const center = new Point(
    canvas.width/2,
    canvas.height/2
)

const game = new Game(canvas);

function checkCollisions(obj) {
    const collisions = game.checkCollisions(obj).map((obj)=>obj.name)
    console.log(collisions)
}

function rotateElement(el) {
    el.rotation += 0.01
}

function createHTMLbutton(text,callback) {
    const button = document.createElement('button')
    button.innerText = text
    button.addEventListener('click', callback)
    document.body.appendChild(button)
    return button
}

// satellites that orbit each other and draw their path on canvas
function spirograph() {
    game.clear()

    // center
    let lastPos = new Point(300,300)
    let drawing = true

    const petals = 6
    const satellites = 4
    const angleDif = 4/6
    const startAngle = -Math.PI/2
    const startRadius = 64

    const lineWidth = 4
    const circleRadius = 4

    let circles, drawn, angles, radii

    function init() {
        // points rotating around each other
        circles = []
        // element that draws the shapes
        drawn = game.createElement({clickable: false})
        drawn.setPosition(0,0)
        // current angles of points relative to each other
        angles = []
        // distance of rotating circles to each other
        radii = []

        for (let i = 0; i < satellites; i++) {
            addAnchor()
        }
    }

    init()

    function rotateAround(element,pos,attrs) {
        element.center = new Point(
            attrs.r * Math.cos(attrs.angle) + pos.x,
            attrs.r * Math.sin(attrs.angle) + pos.y
        )
    }

    function addAnchor() {
        let pos, newR

        let lastCircle
        if (circles.length > 0) {
            // pridavam
            pos = circles[circles.length-1].center
            newR = radii[radii.length-1] * angleDif

            lastCircle = new GameElement(
                new Point(
                    newR * Math.cos(0) + pos.x,
                    newR * Math.sin(0) + pos.y
                ),
                [new GameShape('oval',{rx:circleRadius,ry:circleRadius,fill:'random',level:1})],
                {clickable:false,name:`${circles.length}`}
            )

            circles.push(lastCircle)

            rotateAround(lastCircle,pos,{r:newR,angle:startAngle})
        } else {
            // vytvaram prvy
            newR = startRadius
            pos = new Point(
                newR * Math.cos(startAngle) + 300,
                newR * Math.sin(startAngle) + 300
            )

            lastCircle = new GameElement(
                pos.copy(),
                [new GameShape('oval',{rx:circleRadius,ry:circleRadius,fill:'random',level:1})],
                {clickable:false,name:`${circles.length}`}
            )

            circles.push(lastCircle)
        }

        radii.push(newR)
        angles.push(startAngle)

        game.addElement(lastCircle)
        drawn.addChild(
            new GameShape('line',{coords:[lastCircle.center.x,lastCircle.center.y,lastCircle.center.x,lastCircle.center.y],stroke:lastCircle.children[0].fill,lineWidth:lineWidth,})
        )
    }

    function keypress(event) {
        console.log(event)
        if (event.key === ' ') {
            addAnchor()
        }
        if (event.key === 'Enter') {
            game.clear()
            init()
        }
        if (event.key === '+') {
            next(drawing)
        }
    }

    function next(isDrawing) {
        for (const i in circles) {
            angles[i] += 0.01 + ((petals/100)*i)

            let pos = lastPos
            if (i > 0) {
                pos = new Point(
                    circles[i-1].center.x,
                    circles[i-1].center.y,
                )
            }
            rotateAround(circles[i],pos,{r:radii[i],angle:angles[i]})

            if (isDrawing) {
                const drawingLine = drawn.children[i]
                drawingLine.addPoint(new Point(circles[i].center.x,circles[i].center.y))
            }
        }
    }

    function tick(isDrawing) {
        next(isDrawing)
        setTimeout(()=>tick(drawing),0)
    }
    tick(drawing)

    const callback = (ev => keypress(ev))

    document.addEventListener('keypress',callback)

    game.addOnClearListener(()=>{document.removeEventListener("keypress",callback)})
}
// spirograph()

// test drag and drop function
function dragDrop() {
    const element1 = new GameElement(center,
        [
            new GameText('1', {level: 2}),
            new GameShape('oval', {
                rx: 100,
                ry: 100,
                fill: 'red',
                level: 1,
                rotation: 0.2,
                stroke: 'black',
                lineWidth: 20
            }),
        ],
        {clickable: true, draggable:true, name: '1-red', level: 10}
    )
    game.addElement(element1)

    function onClick() {
        console.log('you touched me ( ͡° ͜ʖ ͡°)')
        console.log('last mouse pos', undefined)
    }

    function onDrag() {
        console.log('wheeeee')
    }

    function onFinish() {
        console.log('thanks for putting me down at', element1.center.asString())
    }

    element1.addOnClickListener(onClick)
    element1.addOnFinishDraggingListener(onFinish)
    element1.addOnDragListener(onDrag)
}
// dragDrop()

// colorful circle objects to test clicking or drawing
function pogs() {
    game.clear()

    const element1 = game.createElement({clickable: true, draggable:true, name: '1-red', level: 10,hitboxVisible:true})
    element1.addHitbox(100)
    element1.setPosition(250,250)
    element1.createText('1', {level: 2})
    element1.createShape('oval', {rx: 100,ry: 100, fill: 'red', level: 1, stroke: 'black', lineWidth: 20})

    const element2 = game.createElement({clickable: true, draggable:true, name: '2-blue', level: 10,hitboxVisible:true})
    element2.addHitbox(100)
    element2.setPosition(350,250)
    element2.createText('2', {level: 2})
    element2.createShape('oval', {rx: 100,ry: 100, fill: 'blue', level: 1, stroke: 'black', lineWidth: 20})

    const element3 = game.createElement({clickable: true, draggable:true, name: '3-green', level: 10,hitboxVisible:true})
    element3.addHitbox(100)
    element3.setPosition(250,350)
    element3.createText('3', {level: 2})
    element3.createShape('oval', {rx: 100,ry: 100, fill: 'green', level: 1, stroke: 'black', lineWidth: 20})

    const element4 = game.createElement({clickable: true, draggable:true, name: '4-yellow', level: 10,hitboxVisible:true})
    element4.addHitbox(100)
    element4.setPosition(350, 350)
    element4.createText('4', {level: 2})
    element4.createShape('oval', {rx: 100,ry: 100, fill: 'yellow', level: 1, stroke: 'black', lineWidth: 20})

    const elements = [element1,element2,element3,element4]

    for (const objt of elements) {
        // THIS IS REPLACED BY game.moveToTopWhenDragging(elements)
        // const moveToTop = () => {
        //     game.changeLevelOfElement(objt,game.highestLevel()+1)
        // }
        // objt.addOnClickListener(moveToTop)

        const checkCollisions = () => {
            const collisions = game.checkCollisions(objt).map((obj)=>obj.name)
            console.log(collisions)
        }
        objt.addOnFinishDraggingListener(checkCollisions)
    }

    game.moveToTopWhenDragging(elements)
}
// pogs()

// test display name of clicked object
function displayClickedName() {
    function onClick(event) {
        const mouse = game.getMousePos(event)
        const clickedElement = game.getElementAtPos(mouse)

        if (clickedElement !== null) {
            console.log(`Clicked element with name: "${clickedElement.name}"`)
        }
    }

    canvas.addEventListener('click',(ev => onClick(ev)))
}
// displayClickedName()

// test move clicked object to top
function moveClickedToTop() {
    function onClick(event) {
        const mouse = game.getMousePos(event)
        const clickedElement = game.getElementAtPos(mouse)

        if (clickedElement !== null) {
            const highestLevel = Math.max(...game.elements.map(el => el.level))
            game.changeLevelOfElement(clickedElement,highestLevel+1)
        }
    }

    canvas.addEventListener('mousedown',(ev => onClick(ev)))
}
// moveClickedToTop()

//test function for G.GameCanvas (but also buttons)
function testGameCanvas() {
    game.clear()

    const gCanvas = game.createCanvas({width:300,height:300,stroke:"red"})
    gCanvas.setPosition(300,200)

    function changeColor(color) {
        gCanvas.stroke = color
    }

    const redButton = game.createButton({color:"red",text:"Red"})
    redButton.setPosition(150,550)
    const greenButton = game.createButton({color:"green",text:"Green"})
    greenButton.setPosition(300,550)
    const blueButton = game.createButton({color:"blue",text:"Blue",textColor:"lightblue"})
    blueButton.setPosition(450,550)

    redButton.addOnButtonPressListener(()=>changeColor('red'))
    greenButton.addOnButtonPressListener(()=>changeColor('green'))
    blueButton.addOnButtonPressListener(()=>changeColor('blue'))

    const clearButton = game.createButton({text:"Erase"})
    clearButton.setPosition(300,450)
    clearButton.addOnButtonPressListener(()=>gCanvas.clear())

    setInterval(()=>rotateElement(gCanvas),20)
}
// testGameCanvas()

// uncomment this to test drawables
function testDrawables() {
    game.clear()

    const e1 = game.createElement({clickable:true,draggable:true})
    e1.setPosition(100,100)
    e1.createGif("jump",{width:200,height:200,stagger:1})

    e1.createImage('frog.png',{width:100,height:100, dx:400})

    const e3 = game.createElement({clickable:true,draggable:true})
    e3.setPosition(100,500)
    e3.createShape("polygon",{coords:[-100,-5,10,-10,30,30]})

    const e4 = game.createElement({clickable:true,draggable:true})
    e4.setPosition(500,500)
    e4.createText("Ahoj :)")
}
// testDrawables()

function testCollisions() {
    const el1 = new GameElement(center.copy().add(new Point(100,0)),
        [
            new GameShape('rectangle',{width:100,height:50,fill:'red',stroke:'black',level:0,rotation:0}),
        ],
        {clickable:true,draggable:true, name:"test1",level:5,hitboxes:[new GameHitbox(50)],hitboxVisible:true}
    )
    game.addElement(el1)

    const el2 = new GameElement(center.copy().subtract(new Point(100,0)),
        [
            new GameShape('rectangle',{width:100,height:50,fill:'red',stroke:'black',level:0,rotation:0}),
        ],
        {clickable:true,draggable:true, name:"test2",level:5,hitboxes:[new GameHitbox(50),new GameHitbox(20,-70)],hitboxVisible:true}
    )
    game.addElement(el2)

    setInterval(()=>rotateElement(el2),20)

    for (const obj of [el1,el2]) {
        obj.addOnFinishDraggingListener(()=>checkCollisions(obj))
    }

}
// testCollisions()

function testKeyboardInput() {
    game.clear()

    const speed = 10

    const collisionText = game.createElement()
    collisionText.setPosition(300,50)
    const textElement = collisionText.createText("NO COLLISION",{level: 10,color:"green",name:"text"})

    const player1 = game.createElement({pressable:true,draggable:true,hitboxVisible:true})
    player1.setPosition(200,300)
    player1.createShape('oval',{rx:50,ry:50,fill:'blue',name:"kruh"})
    player1.createText("1",{level: 1})
    player1.addHitbox(50)

    const player2 = game.createElement({pressable:true,draggable:true,hitboxVisible:true})
    player2.setPosition(400,300)
    player2.createShape('oval',{rx:50,ry:50,fill:'red',name:"kruh"})
    player2.createText("2",{level: 1})
    player2.addHitbox(50)

    player1.addOnKeyHoldListener("w",()=>player1.move(new Point(0,-speed)))
    player1.addOnKeyHoldListener("a",()=>player1.move(new Point(-speed,0)))
    player1.addOnKeyHoldListener("s",()=>player1.move(new Point(0,speed)))
    player1.addOnKeyHoldListener("d",()=>player1.move(new Point(speed,0)))

    player2.addOnKeyHoldListener("ArrowUp",()=>player2.move(new Point(0,-speed)))
    player2.addOnKeyHoldListener("ArrowLeft",()=>player2.move(new Point(-speed,0)))
    player2.addOnKeyHoldListener("ArrowDown",()=>player2.move(new Point(0,speed)))
    player2.addOnKeyHoldListener("ArrowRight",()=>player2.move(new Point(speed,0)))

    function setRandomFill() {
        this.getChildByName("kruh").fill = "random"
    }
    player1.addOnKeyPressListener(" ",setRandomFill)
    player2.addOnKeyPressListener(" ",setRandomFill)

    let colided = false

    function collisionsForPlayer(player) {
        const collisions = game.checkCollisions(player)

        if (collisions.length > 0 && !colided) {
            textElement.color = "red"
            textElement.text = "COLLISION"
            console.log("COLLISION!")
            colided = true
        } else if (collisions.length === 0 && colided) {
            textElement.color = "green"
            textElement.text = "NO COLLISION"
            console.log("COLLISION IS NO MORE!")
            colided = false
        }
    }

    player1.addOnMoveListener(()=>{
        collisionsForPlayer(player1)
    })
    player2.addOnMoveListener(()=>{
        collisionsForPlayer(player2)
    })

    game.addOnClearListener(()=>console.clear())
}
// testKeyboardInput()

function testConnectBoxes() {
    game.clear()

    const coordsX = [100,500]
    const coordsY = [100,300,500]
    const values = [["a","b","c"],["A","B","C"]]
    for (let i = 0; i < coordsX.length; i++) {
        for (let j = 0; j < coordsY.length; j++) {
            const el = game.createElement()
            el.setPosition(coordsX[i],coordsY[j])
            el.addChild(new GameShape('rectangle',{width:100,height:50,fill:"tan"}))
            el.addChild(new GameText(values[i][j],{level: 1}))
            el.addChild(new GameShape("line",{coords:[0,0,0,0],name:"line",level: 2,stroke:'black',lineWidth:2}))
            el.clickable = true
            el.draggable = true
            el.stationary = true
            el.setName(game,values[i][j])

            const line = game.createElement()
            line.setPosition(coordsX[i],coordsY[j])
            line.addChild(new GameShape("line",{coords:[0,0,0,0],name:"line",stroke:'black',lineWidth:2}))
            line.level = 2
            line.setName(game,`line${values[i][j]}`)
        }
    }
    for (let i = 0; i < coordsX.length; i++) {
        for (let j = 0; j < coordsY.length; j++) {
            const letter = values[i][j]

            const element = game.getElementByName(letter)
            element.addOnClickListener(()=>{
                const line = game.getElementByName(`line${letter}`).getChildByName("line")
                line.setLine(new Point(0,0),game.shared.mousePos.subtract(element.center))
            })
            element.addOnDragListener(()=>{
                const line = game.getElementByName(`line${letter}`).getChildByName("line")
                line.setLine(new Point(0,0),game.shared.mousePos.subtract(element.center))
            })
            element.addOnFinishDraggingListener(() => {
                const target = game.getElementAtPos(game.shared.mousePos)
                const line = game.getElementByName(`line${letter}`).getChildByName("line")
                // if on the same side or air
                if (target === null || target.center.x === element.center.x) {
                    //return to original
                    line.setLine(new Point(0,0),new Point(0,0))
                    return
                }

                //snap line
                line.setLine(new Point(0,0),target.center.subtract(element.center))
                //color based on correctness
                if (letter.toLowerCase() === target.name.toLowerCase()) {
                    line.stroke = 'green'
                } else {
                    line.stroke = 'red'
                }
                // disable elements
                element.draggable = false
                element.clickable = false
                target.draggable = false
                target.clickable = false
            })
        }
    }
}
// testConnectBoxes()

function testTextInput() {
    game.clear()

    const input = game.createTextInput({text:"Click Me!"})
    input.setPosition(300,300)

    let i = 1
    input.message = `Message ${i}`

    input.addOnEnterTextListener(()=> {
        i += 1
        input.message = `Message ${i}`
        console.log(input.text)
    })
}
// testTextInput()

function testCopyDrawables() {
    const gif = new GameGif('jump',{name:"gif",width:100,height:100,stagger:0})
    const text = new GameText('text',{name:"text"})
    const img = new GameImage('frog.png',{name:'img',width:100,height:100})
    const shape = new GameShape('polygon',{name:'shape', coords:[-100,-5,10,-10,30,30],fill:'red',stroke:'black',rotation:0.3})

    const topLeft = new GameElement(new Point(100,100),[],{})
    game.addElement(topLeft)
    const topRight = new GameElement(new Point(500,100),[],{})
    game.addElement(topRight)
    const bottomLeft = new GameElement(new Point(100,500),[],{})
    game.addElement(bottomLeft)
    const bottomRight = new GameElement(new Point(500,500),[],{})
    game.addElement(bottomRight)

    const c1 = img.copy()
    const c2 = c1.copy()
    c2.rotation = 1
    const c3 = c2.copy()
    c2.rotation = 0
    const c4 = c3.copy()

    topLeft.addChild(c1)
    topRight.addChild(c2)
    bottomLeft.addChild(c3)
    bottomRight.addChild(c4)
}
// testCopyDrawables()

function testCopyElements() {
    const redButton = game.createButton({color:'red',text:'Original'})
    redButton.setPosition(100,50)
    const redButtonCB = ()=>console.log("Original")
    redButton.addOnButtonPressListener(redButtonCB)

    redButton.addOnMoveListener(()=>console.log("ayy lmao"))

    const copyButton = redButton.copy()
    copyButton.text = "Copy"
    copyButton.center = new Point(500,50)
    copyButton.removeOnButtonPressListener(redButtonCB)
    copyButton.addOnButtonPressListener(()=>console.log("Copy"))
    game.addElement(copyButton)

    const canvas = game.createCanvas({width:100,height:100,stroke:"red"})
    canvas.setPosition(100,150)

    const copyCanvas = game.copyElement(canvas)
    copyCanvas.stroke = "green"
    copyCanvas.setPosition(500,150)

    const input = game.createTextInput()
    input.setPosition(100,300)
    input.text = "Original"

    const copyInput = game.copyElement(input)
    copyInput.setPosition(500,300)
    copyInput.text = "Copy"

    const element = game.createElement({clickable:true})
    element.setPosition(100,350)
    element.addChild(new GameShape("rectangle",{width:50,height:20,fill:"red",name:"rect"}))
    const cb = ()=>console.log("click original")
    element.addOnClickListener(cb)

    const copyElement = game.copyElement(element)
    copyElement.setPosition(500,350)
    copyElement.getChildByName("rect_copy").fill = "green"
    copyElement.removeOnClickListener(cb)
    copyElement.addOnClickListener(()=>console.log("click copy"))

    const composite = game.createComposite({draggable:true})
    composite.addElements(redButton,copyButton,canvas,copyCanvas)

    const copyCompositeButton = game.copyElement(redButton)
    copyCompositeButton.setPosition(300,500)

    const copyComposite = game.copyElement(composite)
    copyComposite.move(new Point(0,400))
    copyComposite.reset()

}
// testCopyElements()

function testSound() {
    game.clear()

    const startButton = game.createButton({color:"lightblue",text:"PLAY"})
    startButton.setPosition(300,100)

    const pauseButton = game.createButton({color:"lightgreen",text:"PAUSE"})
    pauseButton.setPosition(300,300)

    const stopButton = game.createButton({color:"red",text:"STOP"})
    stopButton.setPosition(300,500)

    const sound = new Audio("resources/rick_roll.mp3")

    startButton.addOnButtonPressListener(()=>sound.play())
    pauseButton.addOnButtonPressListener(()=>sound.pause())
    stopButton.addOnButtonPressListener(()=> {
        sound.pause()
        sound.currentTime = 0
    })

    game.addOnClearListener(()=>{
        sound.pause()
        sound.currentTime = 0
    })
}
// testSound()

function testComposite() {
    game.clear()

    const el1 = game.createElement({name:"image",draggable:true})
    el1.setPosition(100,300)
    el1.addChild(new GameImage('frog.png',{name:'img',width:100,height:100}))

    const el2 = game.createElement()
    el2.setPosition(500,300)
    el2.setName(game,"poly")
    el2.addChild(new GameShape('polygon',{name:'shape', coords:[-100,-5,10,-10,30,30],fill:'red',stroke:'black',rotation:0.3}))
    el2.draggable = true

    const el3 = game.createElement()
    el3.setPosition(300,500)
    el3.setName(game,"jump")
    el3.addChild(new GameGif('jump',{name:"gif",width:100,height:100,stagger:0}))
    el3.draggable = true

    const centerPoint = game.createElement()
    centerPoint.setPosition(300,300)
    centerPoint.addChild(new GameShape("oval",{rx:10,ry:10,fill:"brown"}))

    const composite = game.createComposite({draggable:true,clickable:true})

    const toggleComposite = game.createButton()
    toggleComposite.setPosition(520,30)
    toggleComposite.text = "toggle composite"
    toggleComposite.width = 150

    function makeComposite() {
        composite.addElement(el1)
        composite.addElement(el2)
        composite.addElement(el3)
        composite.addElement(centerPoint)

        toggleComposite.color = "green"
        toggleComposite.removeOnButtonPressListener(makeComposite)
        toggleComposite.addOnButtonPressListener(resetComposite)
    }
    makeComposite()
    function resetComposite() {
        composite.reset()

        toggleComposite.color = "red"
        toggleComposite.removeOnButtonPressListener(resetComposite)
        toggleComposite.addOnButtonPressListener(makeComposite)
    }

    const elRotButt = game.createButton()
    elRotButt.setPosition(80,30)
    elRotButt.text = "rotate elements"
    elRotButt.width = 150

    let elementInterval = undefined
    function rotateElements() {
        elementInterval = setInterval(()=> {
            el1.rotation += 0.1
            el2.rotation += 0.1
            el3.rotation += 0.1
        },20)

        elRotButt.color = "green"
        elRotButt.removeOnButtonPressListener(rotateElements)
        elRotButt.addOnButtonPressListener(stopElementRotation)
    }
    function stopElementRotation() {
        if (elementInterval) {
            clearInterval(elementInterval)
            elementInterval = undefined
        }
        elRotButt.color = "red"
        elRotButt.removeOnButtonPressListener(stopElementRotation)
        elRotButt.addOnButtonPressListener(rotateElements)
    }
    stopElementRotation()

    const compRotButt = game.createButton()
    compRotButt.setPosition(80,85)
    compRotButt.text = "rotate composite"
    compRotButt.width = 150

    let compositeInterval = undefined
    function rotateComposite() {
        if (!composite.hasElements()) {
            return
        }
        compositeInterval = setInterval(()=> {
            composite.rotateElements(composite.center.add(new Point(300,300)),0.01,true)
        },20)

        compRotButt.color = "green"
        compRotButt.removeOnButtonPressListener(rotateComposite)
        compRotButt.addOnButtonPressListener(stopCompositeRotation)
    }
    function stopCompositeRotation() {
        if (compositeInterval) {
            clearInterval(compositeInterval)
            compositeInterval = undefined
        }
        compRotButt.color = "red"
        compRotButt.removeOnButtonPressListener(stopCompositeRotation)
        compRotButt.addOnButtonPressListener(rotateComposite)
    }
    stopCompositeRotation()
}
// testComposite()

function testMoveToArea() {
    game.clear()

    const el = game.createElement({name: "movingElement"})
    el.setPosition(300,300)
    el.draggable = true
    el.addChild(new GameShape("oval",{rx:50,ry:50,fill:"red"}))
    el.addChild(new GameText("DRAG ME!",{name:"text",maxWidth:90}))



    el.addOnMoveListener(()=>{
        const textElement = el.getChildByName("text")
        textElement.text = ""

        if (el.center.yWithin(0,200)) textElement.text += "TOP"
        else if (el.center.yWithin(200, 400)) textElement.text += "CENTER"
        else if (el.center.yWithin(400,600)) textElement.text += "BOTTOM"

        if (el.center.xWithin(0,200)) textElement.text += " LEFT"
        else if (el.center.xWithin(200, 400)) {
            if (textElement.text !== "CENTER") textElement.text += " CENTER"
        }
        else if (el.center.xWithin(400,600)) textElement.text += " RIGHT"
    })
}
// testMoveToArea()

function testListeners() {
    const element = game.createElement({clickable:true,draggable:true})
    element.setPosition(300,300)
    element.addChild(new GameShape("rectangle",{width:300,height:300,fill:"tan"}))

    function clickFunction(ev){
        // const buttons = ["uhhhhhhhhhhhh","left","middle","right"]
        // console.log(buttons[ev.which],"click")
        console.log("click",ev)
        console.log("this",this)
    }
    element.addOnClickListener(clickFunction)
    // element.removeOnClickListener(clickFunction)

    const dragFunction = ev=>{
        console.log("drag",ev)
    }
    element.addOnDragListener(dragFunction)
    element.removeOnDragListener(dragFunction)

    const finishDragFunction = ev=>{
        console.log("finish drag",ev)
    }
    element.addOnFinishDraggingListener(finishDragFunction)
    element.removeOnFinishDraggingListener(finishDragFunction)

    const keyPressFunction = ev=>{
        console.log("key press",ev)
    }
    element.addOnKeyPressListener(" ",keyPressFunction)
    element.removeOnKeyPressListener(" ",keyPressFunction)

    const keyHoldFunction = ev=>{
        console.log("key hold",ev)
    }
    element.addOnKeyHoldListener("ArrowRight",keyHoldFunction)
    element.removeOnKeyHoldListener("ArrowRight",keyHoldFunction)
}
// testListeners()

function testGrid() {
    game.clear()

    const grid = game.createGrid()
    grid.setPosition(100,100)
    grid.width = 400
    grid.height = 400

    function finishDragging() {
        if (grid.isInside(this.center)) {
            const colRow = grid.getPosFromPixels(this.center.x,this.center.y)

            try {
                if (!this.grid) {
                    grid.addElement(colRow.x, colRow.y, this)
                } else {
                    grid.moveElement(colRow.x, colRow.y, this)
                }
            } catch (e) {
                if (e instanceof grid.FullError) {
                    grid.snapElement(this)
                    return
                }
            }

            console.log(colRow.asString())
        } else {
            if (this.grid) {
                grid.removeElement(this)
            }
        }
    }

    function addElement(first=false) {
        const freePos = grid.randomFreePosition()
        const newElement = game.createElement({draggable:true,pressable:true})
        newElement.createShape("oval", {rx: 20,fill:(first)?"blue":"red"})
        grid.addElement(...freePos.asArray(), newElement)
        newElement.addOnFinishDraggingListener(finishDragging)
        return newElement
    }

    const element = addElement(true)



    const stagger = 10
    let stg = 0

    element.addOnKeyUpListener(function (event) {
        if ("wasd".includes(event.key)) {
            stg = 0
        }
    })

    function move(dx,dy) {
        if (this.grid) {
            if (stg) {
                stg--
                return
            } else {
                stg = stagger
            }
        }
        try {
            this.move(new Point(dx, dy))
        } catch (e) {
            if (e instanceof grid.FullError) {
                return;
            }
        }
    }

    element.addOnKeyHoldListener("w",function () {
        move.call(this,0, -10)
    })
    element.addOnKeyHoldListener("a",function () {
        move.call(this,-10,0)
    })
    element.addOnKeyHoldListener("s",function () {
        move.call(this,0, 10)
    })
    element.addOnKeyHoldListener("d",function () {
        move.call(this,10,0)
    })

    const button = game.createButton({text:"Add Element"})
    button.setPosition(300,50)

    button.addOnButtonPressListener(()=>{
        const start = Date.now()
        addElement()
        const duration = Date.now() - start
        console.log(`It took ${duration} ms`)
    })

}
// testGrid()

function testElementHold() {
    const el = game.createElement({holdable:true})
    el.createShape("rectangle")

    el.addOnMouseHoldListener(function () {
        console.log("holding")
    })
}
// testElementHold()

function testRangeSlider() {
    game.clear()

    const slider1 = game.createRangeSlider({color:"blue",min:0,max:1,floating:true})
    slider1.setPosition(300,100)
    const slider2 = game.createRangeSlider({min:0,max:1,floating:true})
    slider2.setValue(0)
    const slider3 = game.createRangeSlider({min:0,max:1,floating:true})
    slider3.setPosition(300,500)

    slider1.addOnChangeListener(function () {
        slider2.width = (this.getValue() * 600) || 1
    })

    slider2.addOnChangeListener(function () {
        slider3.rotation = this.getValue() * Math.PI * 2
    })

    slider3.addOnChangeListener(function () {
        this.color = "random"
    })
}
// testRangeSlider()

function testAnimateTo() {
    game.clear()

    const element = game.createElement()
    element.setPosition(300,300)
    const oval = element.createShape("oval")

    game.addOnMouseDownListener(function (event) {
        const mousePos = this.getMousePos(event)
        element.animateTo(mousePos,50)
    })

    game.addOnMouseMoveListener(function (event) {
        if (event.buttons === 0) {
            return
        }
        const mousePos = this.getMousePos(event)
        element.animateTo(mousePos,2)
    })
    game.addOnMouseUpListener(function (event) {
        oval.fill = "random"
    })
}
// testAnimateTo()

function testIntegerSlider() {
    game.clear()

    const floatingSlider = game.createRangeSlider({width:200,min:-1,max:1,floating:true})
    floatingSlider.setPosition(400,100)
    const floatingValueElement = game.createElement()
    floatingSlider.textElement = floatingValueElement.createText(`${floatingSlider.getValue()}`,{font:"40px arial"})
    floatingValueElement.setPosition(400,200)

    const floatingText = game.createElement()
    floatingText.createText("Decimal numbers")
    floatingText.setPosition(100,150)

    const integerSlider = game.createRangeSlider({width:200,min:-5,max:5,color:"blue"})
    integerSlider.setPosition(400,400)
    const integerValueElement = game.createElement()
    integerSlider.textElement = integerValueElement.createText(`${integerSlider.getValue()}`,{font:"40px arial"})
    integerValueElement.setPosition(400,500)

    const integerText = game.createElement()
    integerText.createText("Integers")
    integerText.setPosition(100,450)

    function displayValue() {
        this.textElement.text = this.getValue()
    }

    floatingSlider.addOnChangeListener(displayValue)
    integerSlider.addOnChangeListener(displayValue)
}
testIntegerSlider()

function testCompositeManipulation() {
    game.clear()

    const e1 = game.createElement({draggable:true,level:0})
    e1.createShape("rectangle",{fill:"green"})
    e1.setPosition(250,250)

    const e2 = game.createElement({draggable:true,level:1})
    e2.createShape("rectangle",{fill:"blue"})

    const e3 = game.createElement({draggable:true,level:2})
    e3.createShape("rectangle",{fill:"red"})
    e3.setPosition(350,350)

    const e4 = game.createElement({draggable:true,level:2})
    e4.createShape("rectangle",{fill:"black"})
    e4.setPosition(400,400)

    const c1 = game.createComposite({draggable:true,level:3})
    c1.setPosition(...e1.center.asArray())
    c1.addElements(e1,e2)

    const c2 = game.createComposite({draggable:true,level:4})
    c2.setPosition(...c1.center.asArray())
    c2.addElements(c1,e3,e4)

    let angle1 = 0
    const slider1 = game.createRangeSlider({min:0,max:Math.PI*2,floating:true,width:400})
    slider1.setPosition(300,20)
    slider1.setValue(0)
    slider1.addOnChangeListener(function () {
        const composite = c1

        composite.rotateElements(composite.center,-angle1)
        angle1 = this.getValue()
        composite.rotateElements(composite.center,angle1)
    })

    let angle2 = 0
    const slider2 = game.createRangeSlider({min:0,max:Math.PI*2,floating:true,width:400})
    slider2.setPosition(300,50)
    slider2.setValue(0)
    slider2.addOnChangeListener(function () {
        const composite = c2

        composite.rotateElements(composite.center,-angle2)
        angle2 = this.getValue()
        composite.rotateElements(composite.center,angle2)
    })

    let angle3 = 0
    const slider3 = game.createRangeSlider({min:0,max:Math.PI*2,floating:true,width:400})
    slider3.setPosition(300,80)
    slider3.setValue(0)
    slider3.addOnChangeListener(function () {
        const composite = c2

        composite.rotateElements(composite.center,-angle3,true)
        angle3 = this.getValue()
        composite.rotateElements(composite.center,angle3,true)
    })
}
// testCompositeManipulation()

function testAveragePoints() {
    game.clear()

    const e1 = game.createElement({draggable:true,level:0})
    e1.createShape("rectangle",{fill:"green"})
    e1.setPosition(300,250)

    const e2 = game.createElement({draggable:true,level:0})
    e2.createShape("rectangle",{fill:"blue"})
    e2.setPosition(200,400)

    const e3 = game.createElement({draggable:true,level:0})
    e3.createShape("rectangle",{fill:"red"})
    e3.setPosition(400,400)

    const centerOval = game.createElement({level:1})
    centerOval.createShape("oval",{fill:"black",rx:10,ry:10})
    centerOval.createText("Center",{font:"20px arial",dy:20})
    centerOval.center = Point.average(e1.center,e2.center,e3.center)

    function updateCenter() {
        centerOval.center = Point.average(e1.center,e2.center,e3.center)
    }
    e1.addOnDragListener(updateCenter)
    e2.addOnDragListener(updateCenter)
    e3.addOnDragListener(updateCenter)
}
// testAveragePoints()

function testHomePosition() {
    game.clear()
    const element = game.createElement({draggable:true})
    element.createShape("rectangle",{fill:"green"})
    element.addOnFinishDraggingListener(function () {
        this.home()
    })

    // element.setHome(100,100)
}
testHomePosition()

function testMiscFunctions() {
    console.log(randomInt(-1,1))
    const array = ["a","b","c","a","b","c","a","b","c"]
    removeFromArray(array,"a",true)
    console.log(array)

    const charArray = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
    console.log(randomSelection(charArray,3))

}
// testMiscFunctions()

function testFunctionCallsButtons() {
    createHTMLbutton("CLEAR AREA",()=>game.clear())
    createHTMLbutton("Pogs",pogs)
    createHTMLbutton("Drawables",testDrawables)
    createHTMLbutton("Connect Boxes",testConnectBoxes)
    createHTMLbutton("Text Input",testTextInput)
    createHTMLbutton("Element Composite",testComposite)
    createHTMLbutton("Range Slider",testRangeSlider)
    createHTMLbutton("Canvas",testGameCanvas)
    createHTMLbutton("Spirograph",spirograph)
    createHTMLbutton("Audio",testSound)
    createHTMLbutton("WASD+Arrows",testKeyboardInput)
    createHTMLbutton("Area Detection",testMoveToArea)
    createHTMLbutton("Animate To",testAnimateTo)
    createHTMLbutton("Grid",testGrid)
    createHTMLbutton("Integer Slider",testIntegerSlider)
    createHTMLbutton("Nested Composites",testCompositeManipulation)
    createHTMLbutton("Average Points",testAveragePoints)
    createHTMLbutton("Home Position",testHomePosition)
}
testFunctionCallsButtons()

game.addOnMouseDownListener(function (event) {
    if (event.buttons === 4) {
        game.screenShot()
    }
})