import {Game, GameElement, GameShape, GameText, GameImage, GameGif, Point, GameCanvas, GameButton, GameHitbox} from "../modules/index.js"

const canvas = document.getElementById('game');
canvas.width = 600;
canvas.height = 600;

const center = new Point(
    canvas.width/2,
    canvas.height/2
)

const game = new Game(canvas);

// test code to check if area is inside an element
// canvas.addEventListener('mousemove',async (event) => await game.drawInside(event))

// satellites that orbit each other and draw their path on canvas
function inspiro() {

    // center
    let lastPos = Point(300,300)
    let drawing = true

    const petals = -2
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
        drawn = new GameElement(new Point(0,0), [], {clickable: false})
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
        element.center = Point(
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
                [new GameShape('oval',{rX:circleRadius,rY:circleRadius,fill:'random',level:1})],
                {clickable:false,name:`${circles.length}`}
            )

            circles.push(lastCircle)

            rotateAround(lastCircle,pos,{r:newR,angle:startAngle})
        } else {
            // vytvaram prvy
            newR = startRadius
            pos = Point(
                newR * Math.cos(startAngle) + 300,
                newR * Math.sin(startAngle) + 300
            )

            lastCircle = new GameElement(
                pos.copy(),
                [new GameShape('oval',{rX:circleRadius,rY:circleRadius,fill:'random',level:1})],
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
                pos = Point(
                    circles[i-1].center.x,
                    circles[i-1].center.y,
                )
            }
            rotateAround(circles[i],pos,{r:radii[i],angle:angles[i]})

            if (isDrawing) {
                const drawingLine = drawn.children[i]
                drawingLine.addPoint(Point(circles[i].center.x,circles[i].center.y))
            }
        }
    }

    function tick(isDrawing) {
        next(isDrawing)
        setTimeout(()=>tick(drawing),0)
    }
    tick(drawing)

    document.addEventListener('keypress',(ev => keypress(ev)))
}
// inspiro()

// test drag and drop function
function dragDrop() {
    const element1 = new GameElement(center,
        [
            new GameText('1', {level: 2}),
            new GameShape('oval', {
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

    element1.addOnClickListener(onClick,game)
    element1.addOnFinishDraggingListener(onFinish)
    element1.addOnDragListener(onDrag)
}
// dragDrop()

// colorful circle objects to test clicking or drawing
function pogs() {
    const element1 = new GameElement(new Point(250, 250),
        [
            new GameText('1', {level: 2}),
            new GameShape('oval', {
                rX: 100,
                rY: 100,
                fill: 'red',
                level: 1,
                rotation: 0.2,
                stroke: 'black',
                lineWidth: 20
            }),
        ],
        {clickable: true, draggable:true, name: '1-red', level: 10,hitboxes:[new GameHitbox(100)],hitboxVisible:true}
    )
    game.addElement(element1)

    const element2 = new GameElement(new Point(350, 250),
        [
            new GameText('2', {level: 10}),
            new GameShape('oval', {
                rX: 100,
                rY: 100,
                fill: 'blue',
                level: 1,
                rotation: 0.2,
                stroke: 'black',
                lineWidth: 20
            }),
        ],
        {clickable: true,draggable:true, name: '2-blue',hitboxes:[new GameHitbox(100)],hitboxVisible:true}
    )
    game.addElement(element2)

    const element3 = new GameElement(new Point(250, 350),
        [
            new GameText('3', {level: 10}),
            new GameShape('oval', {
                rX: 100,
                rY: 100,
                fill: 'green',
                level: 1,
                rotation: 0.2,
                stroke: 'black',
                lineWidth: 20
            }),
        ],
        {clickable: true,draggable:true, name: '3-green', level: 1,hitboxes:[new GameHitbox(100)],hitboxVisible:true}
    )
    game.addElement(element3)

    const element4 = new GameElement(new Point(350, 350),
        [
            new GameText('4', {level: 10}),
            new GameShape('oval', {
                rX: 100,
                rY: 100,
                fill: 'yellow',
                level: 1,
                rotation: 0.2,
                stroke: 'black',
                lineWidth: 20
            }),
        ],
        {clickable: true,draggable:true, name: '4-yellow',hitboxes:[new GameHitbox(100)],hitboxVisible:true}
    )
    game.addElement(element4)

    function topLevel() {
        return Math.max(element1.level,element2.level,element3.level,element4.level)
    }

    function moveToTop(attrs={obj:undefined,level:undefined}) {
        game.changeLevel(attrs.obj,attrs.level()+1)
    }

    function checkCollisions(obj) {
        const collisions = game.checkCollisions(obj).map((obj)=>obj.name)
        console.log(collisions)
    }

    for (const objt of [element1,element2,element3,element4]) {
        objt.addOnClickListener(moveToTop,{obj: objt,level:topLevel})
        objt.addOnFinishDraggingListener(checkCollisions,objt)
    }
}
pogs()

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

            clickedElement.level = highestLevel + 1
            game.updateLevels()
        }
    }

    canvas.addEventListener('mousedown',(ev => onClick(ev)))
}
// moveClickedToTop()

//test function for GameCanvas (but also buttons)
function testGameCanvas() {
    const gCanvas = new GameCanvas(new Point(300,150),{width:600})
    game.addElement(gCanvas)

    function changeColor(color) {
        gCanvas.stroke = color
    }

    const redButton = new GameButton(new Point(150,450),{color:'red',text:'Červená'})
    const greenButton = new GameButton(new Point(300,450),{color:'green',text:'Zelená'})
    const blueButton = new GameButton(new Point(450,450),{color:'blue',text:'Modrá'})
    game.addElement(redButton)
    game.addElement(greenButton)
    game.addElement(blueButton)
    redButton.addOnButtonPressListener(changeColor,'red')
    greenButton.addOnButtonPressListener(changeColor,'green')
    blueButton.addOnButtonPressListener(changeColor,'blue')

    const clearButton = new GameButton(new Point(300,375),{text:'Zmaž'})
    game.addElement(clearButton)
    clearButton.addOnButtonPressListener(()=>gCanvas.clear())

    redButton.addOnButtonPressListener(()=>console.log(gCanvas.children),'red')
}
// testGameCanvas()

// uncomment this to test drawables
function testDrawables() {
    const test = new GameElement(center.copy(),
        [
            new GameText('text',{level:10,dx:-100,rotation:-0.3}),
            new GameText('text',{level:10,dx:100,rotation:-0.3,hScale:-1}),
            new GameShape('rectangle',{width:100,height:50,dx:-100,fill:'red',stroke:'black',level:0,rotation:0}),
            new GameShape('rectangle',{width:100,height:200,stroke:'black',fill:'red',lineWidth:2,level:1,rotation:0.3}),
            new GameText('level1',{level:1}),
            new GameShape('oval',{rX:100,rY:50,fill:'red',level:1,stroke:'black',lineWidth:20,rotation:Math.PI/2}),
            new GameShape('oval',{rX:50,rY:20,dx:200, dy:200,fill:'blue',level:1,rotation:0.4}),
            new GameShape('polygon',{name:'poly center',level:6, coords:[-100,-5,10,-10,30,30],fill:'red',stroke:'black',rotation:0.3}),
            new GameShape('polygon',{name:'poly center mirrored',level:6, coords:[-100,-5,10,-10,30,30],fill:'red',stroke:'black',rotation:0.3,hScale:-1}),
            new GameShape('polygon',{name:'poly right',level:6,dx:200, coords:[-100,-5,10,-10,30,30],fill:'red',rotation:1}),
            new GameShape('line',{level:6, coords:[-100,-5,10,-10,30,30,200,-200],stroke:'black',lineWidth:50,}),
            new GameShape('line',{level:7, coords:[-100,-5,10,-10,30,30,200,-200],stroke:'red',lineWidth:2,}),
            new GameImage('frog','png',{name:'frog1',dy:100,level:0,width:100,height:100,rotation:0}),
            new GameImage('frog','png',{name:'frog3',dy:100,level:0,width:100,height:100,rotation:Math.PI}),
            new GameImage('frog','png',{name:'frog2',level:0,dx:200,dy:200,width:200,height:100,rotation:-0.8}),
            new GameGif('jump',{level:0,width:400,height:200,stagger:0}),
            new GameGif('jump',{level:0,width:400,height:200,stagger:0,hScale:-1}),
            new GameGif('colors',{level:-1,stagger:10,width:600,height:600}),
        ],
        {clickable:true,draggable:true, name:"test",level:5}
    )
    game.addElement(test)
}
// testDrawables()

