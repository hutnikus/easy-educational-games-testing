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

// test code to check if area is inside an element
function isInside() {
    canvas.addEventListener('mousemove',async (event) => await game.drawInside(event))

    document.addEventListener("keyup",(e)=>{
        if (e.code === "Space") {
            e.preventDefault()
            game.popElementByName("drawInside")
        }
    })
}
// isInside()

// satellites that orbit each other and draw their path on canvas
function spirograph() {
    game.clear()

    // center
    let lastPos = new G.Point(300,300)
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
        drawn = new G.GameElement(new G.Point(0,0), [], {clickable: false})
        game.addElement(drawn)
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
        element.center = new G.Point(
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

            lastCircle = new G.GameElement(
                new G.Point(
                    newR * Math.cos(0) + pos.x,
                    newR * Math.sin(0) + pos.y
                ),
                [new G.GameShape('oval',{rX:circleRadius,rY:circleRadius,fill:'random',level:1})],
                {clickable:false,name:`${circles.length}`}
            )

            circles.push(lastCircle)

            rotateAround(lastCircle,pos,{r:newR,angle:startAngle})
        } else {
            // vytvaram prvy
            newR = startRadius
            pos = new G.Point(
                newR * Math.cos(startAngle) + 300,
                newR * Math.sin(startAngle) + 300
            )

            lastCircle = new G.GameElement(
                pos.copy(),
                [new G.GameShape('oval',{rX:circleRadius,rY:circleRadius,fill:'random',level:1})],
                {clickable:false,name:`${circles.length}`}
            )

            circles.push(lastCircle)
        }

        radii.push(newR)
        angles.push(startAngle)

        game.addElement(lastCircle)
        drawn.addChild(
            new G.GameShape('line',{coords:[lastCircle.center.x,lastCircle.center.y,lastCircle.center.x,lastCircle.center.y],stroke:lastCircle.children[0].fill,lineWidth:lineWidth,})
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
                pos = new G.Point(
                    circles[i-1].center.x,
                    circles[i-1].center.y,
                )
            }
            rotateAround(circles[i],pos,{r:radii[i],angle:angles[i]})

            if (isDrawing) {
                const drawingLine = drawn.children[i]
                drawingLine.addPoint(new G.Point(circles[i].center.x,circles[i].center.y))
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
    const element1 = new G.GameElement(center,
        [
            new G.GameText('1', {level: 2}),
            new G.GameShape('oval', {
                rX: 100,
                rY: 100,
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
    element1.createShape('oval', {rX: 100,rY: 100, fill: 'red', level: 1, stroke: 'black', lineWidth: 20})

    const element2 = game.createElement({clickable: true, draggable:true, name: '2-blue', level: 10,hitboxVisible:true})
    element2.addHitbox(100)
    element2.setPosition(350,250)
    element2.createText('2', {level: 2})
    element2.createShape('oval', {rX: 100,rY: 100, fill: 'blue', level: 1, stroke: 'black', lineWidth: 20})

    const element3 = game.createElement({clickable: true, draggable:true, name: '3-green', level: 10,hitboxVisible:true})
    element3.addHitbox(100)
    element3.setPosition(250,350)
    element3.createText('3', {level: 2})
    element3.createShape('oval', {rX: 100,rY: 100, fill: 'green', level: 1, stroke: 'black', lineWidth: 20})

    const element4 = game.createElement({clickable: true, draggable:true, name: '4-yellow', level: 10,hitboxVisible:true})
    element4.addHitbox(100)
    element4.setPosition(350, 350)
    element4.createText('3', {level: 2})
    element4.createShape('oval', {rX: 100,rY: 100, fill: 'yellow', level: 1, stroke: 'black', lineWidth: 20})

    const elements = [element1,element2,element3,element4]

    for (const objt of elements) {
        const moveToTop = () => {
            game.changeLevelOfElement(objt,game.highestLevel()+1)
        }
        objt.addOnClickListener(moveToTop)

        const checkCollisions = () => {
            const collisions = game.checkCollisions(objt).map((obj)=>obj.name)
            console.log(collisions)
        }
        objt.addOnFinishDraggingListener(checkCollisions)
    }
}
// pogs()

// test display name of clicked object
function displayClickedName() {
    async function onClick(event) {
        const mouse = game.getMousePos(event)
        const clickedElement = await game.getElementAtPos(mouse)

        if (clickedElement !== null) {
            console.log(`Clicked element with name: "${clickedElement.name}"`)
        }
    }

    canvas.addEventListener('click',(ev => onClick(ev)))
}
// displayClickedName()

// test move clicked object to top
function moveClickedToTop() {
    async function onClick(event) {
        const mouse = game.getMousePos(event)
        const clickedElement = await game.getElementAtPos(mouse)

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
    const element = game.createElement({clickable:true,draggable:true, name:"test",level:5})
    element.setPosition(300,300)

    // const gif = element.createGif("jump",{width:200,height:200,stagger:1})
    // const img = element.createImage('frog.png',{width:100,height:100})
    // const rect = element.createShape("rectangle",{width:500,rotation:0.3})
    // const oval = element.createShape("oval",{rX:100})
    // const poly = element.createShape("polygon",{coords:[-100,-5,10,-10,30,30]})
    // const line = element.createShape("line",{coords:[-100,-5,10,-10,30,30]})
    // const text = element.createText("Hewwo uwu")

    // element.addChild(new G.GameText('text',{level:10,dx:-100,rotation:-0.3}))
    // element.addChild(new G.GameText('text',{level:10,dx:100,rotation:-0.3,hScale:-1}))
    // element.addChild(new G.GameShape('rectangle',{width:100,height:50,dx:-100,fill:'red',stroke:'black',level:0,rotation:0}))
    // element.addChild(new G.GameShape('rectangle',{width:100,height:200,stroke:'black',fill:'red',lineWidth:2,level:1,rotation:0.3}))
    // element.addChild(new G.GameText('level1',{level:1}))
    // element.addChild(new G.GameShape('oval',{rX:100,rY:50,fill:'red',level:1,stroke:'black',lineWidth:20,rotation:Math.PI/2}))
    // element.addChild(new G.GameShape('oval',{rX:50,rY:20,dx:200, dy:200,fill:'blue',level:1,rotation:0.4}))
    // element.addChild(new G.GameShape('polygon',{name:'poly center',level:6, coords:[-100,-5,10,-10,30,30],fill:'red',stroke:'black',rotation:0.3}))
    // element.addChild(new G.GameShape('polygon',{name:'poly center mirrored',level:6, coords:[-100,-5,10,-10,30,30],fill:'red',stroke:'black',rotation:0.3,hScale:-1}))
    // element.addChild(new G.GameShape('polygon',{name:'poly right',level:6,dx:200, coords:[-100,-5,10,-10,30,30],fill:'red',rotation:1}))
    // element.addChild(new G.GameShape('line',{level:6, coords:[-100,-5,10,-10,30,30,200,-200],stroke:'black',lineWidth:50,}))
    // element.addChild(new G.GameShape('line',{level:7, coords:[-100,-5,10,-10,30,30,200,-200],stroke:'red',lineWidth:2,}))
    // element.addChild(new G.GameImage('frog.png',{name:'frog1',dy:100,level:0,width:100,height:100,rotation:0}))
    // element.addChild(new G.GameImage('frog.png',{name:'frog3',dy:100,level:0,width:100,height:100,rotation:Math.PI}))
    // element.addChild(new G.GameImage('frog.png',{name:'frog2',level:0,dx:200,dy:200,width:200,height:100,rotation:-0.8}))
    // element.addChild(new G.GameGif('jump',{level:0,width:400,height:200,stagger:0}))
    // element.addChild(new G.GameGif('jump',{level:0,width:400,height:200,stagger:0,hScale:-1}))
    // element.addChild(new G.GameGif('colors',{level:-1,stagger:10,width:600,height:600}))

}
// testDrawables()

function testCollisions() {
    const el1 = new G.GameElement(center.copy().add(new G.Point(100,0)),
        [
            new G.GameShape('rectangle',{width:100,height:50,fill:'red',stroke:'black',level:0,rotation:0}),
        ],
        {clickable:true,draggable:true, name:"test1",level:5,hitboxes:[new G.GameHitbox(50)],hitboxVisible:true}
    )
    game.addElement(el1)

    const el2 = new G.GameElement(center.copy().subtract(new G.Point(100,0)),
        [
            new G.GameShape('rectangle',{width:100,height:50,fill:'red',stroke:'black',level:0,rotation:0}),
        ],
        {clickable:true,draggable:true, name:"test2",level:5,hitboxes:[new G.GameHitbox(50),new G.GameHitbox(20,-70)],hitboxVisible:true}
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
    player1.createShape('oval',{rX:50,rY:50,fill:'blue',name:"kruh"})
    player1.createText("1",{level: 1})
    player1.addHitbox(50)

    const player2 = game.createElement({pressable:true,draggable:true,hitboxVisible:true})
    player2.setPosition(400,300)
    player2.createShape('oval',{rX:50,rY:50,fill:'red',name:"kruh"})
    player2.createText("2",{level: 1})
    player2.addHitbox(50)

    player1.addOnKeyHoldListener("w",()=>player1.move(new G.Point(0,-speed)))
    player1.addOnKeyHoldListener("a",()=>player1.move(new G.Point(-speed,0)))
    player1.addOnKeyHoldListener("s",()=>player1.move(new G.Point(0,speed)))
    player1.addOnKeyHoldListener("d",()=>player1.move(new G.Point(speed,0)))

    player2.addOnKeyHoldListener("ArrowUp",()=>player2.move(new G.Point(0,-speed)))
    player2.addOnKeyHoldListener("ArrowLeft",()=>player2.move(new G.Point(-speed,0)))
    player2.addOnKeyHoldListener("ArrowDown",()=>player2.move(new G.Point(0,speed)))
    player2.addOnKeyHoldListener("ArrowRight",()=>player2.move(new G.Point(speed,0)))

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
            el.addChild(new G.GameShape('rectangle',{width:100,height:50,fill:"tan"}))
            el.addChild(new G.GameText(values[i][j],{level: 1}))
            el.addChild(new G.GameShape("line",{coords:[0,0,0,0],name:"line",level: 2,stroke:'black',lineWidth:2}))
            el.clickable = true
            el.draggable = true
            el.stationary = true
            el.setName(game,values[i][j])

            const line = game.createElement()
            line.setPosition(coordsX[i],coordsY[j])
            line.addChild(new G.GameShape("line",{coords:[0,0,0,0],name:"line",stroke:'black',lineWidth:2}))
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
                line.setLine(new G.Point(0,0),game.shared.mousePos.subtract(element.center))
            })
            element.addOnDragListener(()=>{
                const line = game.getElementByName(`line${letter}`).getChildByName("line")
                line.setLine(new G.Point(0,0),game.shared.mousePos.subtract(element.center))
            })
            element.addOnFinishDraggingListener(async () => {
                const target = await game.getElementAtPos(game.shared.mousePos)
                const line = game.getElementByName(`line${letter}`).getChildByName("line")
                // if on the same side or air
                if (target === null || target.center.x === element.center.x) {
                    //return to original
                    line.setLine(new G.Point(0,0),new G.Point(0,0))
                    return
                }

                //snap line
                line.setLine(new G.Point(0,0),target.center.subtract(element.center))
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

    const input = game.createTextInput()
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
    const gif = new G.GameGif('jump',{name:"gif",width:100,height:100,stagger:0})
    const text = new G.GameText('text',{name:"text"})
    const img = new G.GameImage('frog.png',{name:'img',width:100,height:100})
    const shape = new G.GameShape('polygon',{name:'shape', coords:[-100,-5,10,-10,30,30],fill:'red',stroke:'black',rotation:0.3})

    const topLeft = new G.GameElement(new G.Point(100,100),[],{})
    game.addElement(topLeft)
    const topRight = new G.GameElement(new G.Point(500,100),[],{})
    game.addElement(topRight)
    const bottomLeft = new G.GameElement(new G.Point(100,500),[],{})
    game.addElement(bottomLeft)
    const bottomRight = new G.GameElement(new G.Point(500,500),[],{})
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
    const redButton = new G.GameButton(new G.Point(100,50),{color:'red',text:'Original'})
    const redButtonCB = ()=>console.log("Original")
    redButton.addOnButtonPressListener(redButtonCB)
    game.addElement(redButton)

    redButton.addOnMoveListener(()=>console.log("ayy lmao"))

    const copyButton = redButton.copy()
    copyButton.text = "Copy"
    copyButton.center = new G.Point(500,50)
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
    element.addChild(new G.GameShape("rectangle",{width:50,height:20,fill:"red",name:"rect"}))
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
    copyComposite.move(new G.Point(0,400))
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

    const sound = new Audio("../resources/rick_roll.mp3")

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
    el1.addChild(new G.GameImage('frog.png',{name:'img',width:100,height:100}))

    const el2 = game.createElement()
    el2.setPosition(500,300)
    el2.setName(game,"poly")
    el2.addChild(new G.GameShape('polygon',{name:'shape', coords:[-100,-5,10,-10,30,30],fill:'red',stroke:'black',rotation:0.3}))
    el2.draggable = true

    const el3 = game.createElement()
    el3.setPosition(300,500)
    el3.setName(game,"jump")
    el3.addChild(new G.GameGif('jump',{name:"gif",width:100,height:100,stagger:2}))
    el3.draggable = true

    const centerPoint = game.createElement()
    centerPoint.setPosition(300,300)
    centerPoint.addChild(new G.GameShape("oval",{rX:10,rY:10,fill:"brown"}))

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
            composite.rotateElements(composite.center.add(new G.Point(300,300)),0.01,true)
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
    el.addChild(new G.GameShape("oval",{rX:50,rY:50,fill:"red"}))
    el.addChild(new G.GameText("DRAG ME!",{name:"text",maxWidth:90}))



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
    element.addChild(new G.GameShape("rectangle",{width:300,height:300,fill:"tan"}))

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

async function testGrid() {
    const grid = game.createGrid()
    grid.setPosition(100,100)
    grid.width = 400
    grid.height = 400

    const element = game.createElement({draggable:true,pressable:true})
    const oval = element.createShape("oval",{rX:20})
    element.setPosition(100,100)

    grid.addElement(0,0,element)

    element.addOnFinishDraggingListener(function () {
        if (grid.isInside(this.center)) {
            const colRow = grid.getPosFromPixels(this.center.x,this.center.y)

            if (!element.grid) {
                grid.addElement(colRow.x,colRow.y,element)
            } else {
                grid.moveElement(colRow.x, colRow.y, element)
            }

            console.log(colRow.asString())
        } else {
            if (element.grid) {
                grid.removeElement(this)
            }
        }
    })

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
        this.move(new G.Point(dx,dy))
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
        function f() {
            const freePos = grid.randomFreePosition()
            const newElement = game.createElement()
            newElement.createShape("oval", {rX: 20})
            grid.addElement(...freePos.asArray(), newElement)
        }
        f()
        const duration = Date.now() - start
        console.log(`It took ${duration} ms`)
    })

}
// await testGrid()

function frogFlyGame() {
    game.clear()

    const grid = game.createGrid(50,50,500,500,10,10)

    const frogElement = game.createElement({pressable:true})
    frogElement.createImage("frog.png",{width:grid.columnWidth(),height:grid.rowHeight()})
    grid.addElement(...grid.randomFreePosition().asArray(),frogElement)

    const flyElement = game.createElement({name:"fly"})
    flyElement.createGif("fly",{width:grid.columnWidth(),height:grid.rowHeight(),stagger:2})
    grid.addElement(...grid.randomFreePosition().asArray(),flyElement)

    let score = 0
    const scoreElement = game.createElement()
    const scoreText = scoreElement.createText(`Score: ${score}`)
    scoreElement.setPosition(100,25)

    function placeFly() {
        const freePos = grid.randomFreePosition()
        grid.placeElement(...freePos.asArray(), flyElement)
    }

    const stagger = 5

    function moveFrog(event,dir) {
        const direction = {
            up: new G.Point(0,-1),
            down: new G.Point(0,1),
            left: new G.Point(-1,0),
            right: new G.Point(1,0)
        }
        const currentPos = grid.getPosFromPixels(...this.center.asArray())
        const nextPos = currentPos.add(direction[dir])

        try {
            const element = grid.getElementAtPos(...nextPos.asArray())
            if (element && element.name === "fly") {
                //position is occupied
                score++
                scoreText.text = `Score: ${score}`
                grid.removeElementAtPosition(...nextPos.asArray())
                this.move(direction[dir])
                placeFly()
                updateCranes()
            } else if (!element) {
                this.move(direction[dir])
            } else {
                alert(`Congrats! You made it to ${score} points!`)
                frogFlyGame()
            }
        } catch (e) {
            if (!(e instanceof RangeError)) {
                throw e
            }
        }
    }

    frogElement.addOnKeyHoldListener("w",function (event) {moveFrog.call(this,event,"up")},stagger)
    frogElement.addOnKeyHoldListener("s",function (event) {moveFrog.call(this,event,"down")},stagger)
    frogElement.addOnKeyHoldListener("a",function (event) {moveFrog.call(this,event,"left")},stagger)
    frogElement.addOnKeyHoldListener("d",function (event) {moveFrog.call(this,event,"right")},stagger)

    const arrows = [    {direction: "up", position: [300,25], coords: [0,-25,-100,25,100,25]},
                        {direction: "left", position: [25,300], coords: [-25,0,25,-100,25,100]},
                        {direction: "down", position: [300,575], coords: [0,25,-100,-25,100,-25]},
                        {direction: "right", position: [575,300], coords: [25,0,-25,-100,-25,100]}    ]

    for (const arrow of arrows) {
        const element = game.createElement({holdable:true})
        element.setPosition(...arrow.position)
        element.createShape("polygon",{coords:arrow.coords})

        element.addOnMouseHoldListener(()=> {
            moveFrog.call(frogElement,undefined,arrow.direction)
        },stagger)
    }

    const cranes = []
    function updateCranes(add=true) {
        if (add && score % 5 === 0) {
            //pridaj
            for (let i = 0; i < Math.floor(score/5); i++) {
                const craneElement = game.createElement()
                cranes.push(craneElement)
                craneElement.createImage("crane.png",{width:grid.columnWidth(),height:grid.rowHeight()})

                if (cranes.length >= grid.columns*grid.rows -2) {
                    break
                }
            }
        }
        //nahodne usporiadaj
        grid.removeElements(...cranes)
        for (const crane of cranes) {
            try {
                const freePos = grid.randomFreePosition()
                grid.addElement(freePos.x,freePos.y,crane)
            } catch (e) {
                if (e instanceof grid.FullError) {
                    alert("Wow, you surely have too much time on your hand, nice!")
                    break
                }
            }
        }
        if (cranes.length >= grid.columns*grid.rows -2) {
            alert("Wow, you surely have too much time on your hand, nice!")
        }
    }

    const shuffleButton = game.createButton({color:"skyblue",width:150,height:30,text:"scare the cranes"})
    shuffleButton.rectangle.lineWidth = 1
    shuffleButton.setPosition(500,25)
    const sound = new Audio("../resources/croak.mp3")

    shuffleButton.addOnButtonPressListener(()=>{
        sound.time = 0
        sound.play()
        updateCranes(false)
    })
}
// frogFlyGame()

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

    const slider1 = game.createRangeSlider({color:"blue"})
    slider1.setPosition(300,100)
    const slider2 = game.createRangeSlider()
    slider2.setValue(0)
    const slider3 = game.createRangeSlider()
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

function testFunctionCallsButtons() {
    createHTMLbutton("CLEAR AREA",()=>game.clear())
    createHTMLbutton("Pogs",pogs)
    createHTMLbutton("Connect Boxes",testConnectBoxes)
    createHTMLbutton("Text Input",testTextInput)
    createHTMLbutton("Element Composite",testComposite)
    createHTMLbutton("Range Slider",testRangeSlider)
    createHTMLbutton("Canvas",testGameCanvas)
    createHTMLbutton("Spirograph",spirograph)
    createHTMLbutton("Audio",testSound)
    createHTMLbutton("WASD+Arrows",testKeyboardInput)
    createHTMLbutton("Area Detection",testMoveToArea)
    createHTMLbutton("Frog Game",frogFlyGame)
    createHTMLbutton("Scales Game",scalesGame)
}
testFunctionCallsButtons()