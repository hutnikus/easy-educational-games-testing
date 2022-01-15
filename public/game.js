import {Game, GameElement, GameShape, GameText, GameImage, GameGif, Point} from "../modules/index.js"

const canvas = document.getElementById('game');
canvas.width = 600;
canvas.height = 600;

const game = new Game(canvas);

// test code to check if area is inside an element
// canvas.addEventListener('mousemove',async (event) => await game.drawInside(event))

// satellites that orbit each other and draw their path on canvas
function inspiro() {

    // center
    let lastPos = Point(300,300)
    let drawing = true

    const petals = 6
    const satellites = 4
    const angleDif = 5/6
    const startAngle = -Math.PI/2
    const startRadius = 64

    const lineWidth = 2
    const circleRadius = 4

    let circles, drawn, angles, radii

    function init() {
        // points rotating around each other
        circles = []
        // element that draws the shapes
        drawn = new GameElement(0, 0, [], {clickable: false})
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
                newR * Math.cos(0) + pos.x,
                newR * Math.sin(0) + pos.y,
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
                pos.x,
                pos.y,
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

// test drawing function
function drawing() {
    let drawElement = undefined;
    let initialPos = undefined;
    function startDrawing(event) {
        const mouse = game.getMousePos(event)
        initialPos = Point(mouse.x,mouse.y)
        drawElement = new GameElement(mouse.x,mouse.y,
            [new GameShape('line',{level:10, coords:[0,0,0,0],stroke:'random',lineWidth:2,name:'line'})],
        )
        game.addElement(drawElement)
    }
    function continueDrawing(event) {
        if (initialPos === undefined || drawElement === undefined) {
            return
        }
        const mouse = game.getMousePos(event)
        const delta = Point(
            mouse.x - initialPos.x,
            mouse.y - initialPos.y
        )
        const line = drawElement.getChildByName('line')
        line.addPoint(delta)
    }
    function finishDrawing(event) {
        if (initialPos === undefined) {
            return
        }
        const mouse = game.getMousePos(event)
        const delta = Point(
            mouse.x - initialPos.x,
            mouse.y - initialPos.y
        )
        const line = drawElement.getChildByName('line')
        line.addPoint(delta)
        drawElement = undefined;
        initialPos = undefined;
    }
    canvas.addEventListener('mousedown',(ev => startDrawing(ev)))
    canvas.addEventListener('mousemove',(ev => continueDrawing(ev)))
    canvas.addEventListener('mouseup',(ev => finishDrawing(ev)))
}
// drawing()

// test drag and drop function (you need to create some elements for this - try uncommenting function call pogs())
function dragDrop() {
    let draggedElement = undefined;
    let delta = undefined;
    async function startDragging(event) {
        const mouse = game.getMousePos(event)
        draggedElement = await game.getElementAtPos(mouse)
        if (draggedElement === null) {
            draggedElement = undefined
            return
        }
        delta = Point(
            mouse.x - draggedElement.center.x,
            mouse.y - draggedElement.center.y
        )
    }
    function continueDragging(event) {
        if (draggedElement === undefined) {
            return false
        }
        const mouse = game.getMousePos(event)
        draggedElement.center = Point(
            mouse.x - delta.x,
            mouse.y - delta.y
        )
        return true
    }
    function finishDragging(event) {
        if (!continueDragging(event)) {
            return
        }
        draggedElement = undefined
    }
    canvas.addEventListener('mousedown',(async ev => await startDragging(ev)))
    canvas.addEventListener('mousemove',(ev => continueDragging(ev)))
    canvas.addEventListener('mouseup',(ev => finishDragging(ev)))
}
dragDrop()

// test button that outputs a text to console
function button() {
    const button = new GameElement(300,300,
        [
            new GameShape('rectangle',{width:200,height:100,fill:'lightgrey',stroke:'black',lineWidth:2}),
            new GameText('Click Me!')
        ],
        {name:'button',level:100}
    )
    game.addElement(button)
    button.addOnClickListener(console.log,'OUCH!')
}
// button()

// colorful circle objects to test clicking or drawing
function pogs() {
    const element1 = new GameElement(250, 250,
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
        {clickable: true, name: '1-red', level: 10}
    )
    game.addElement(element1)

    const element2 = new GameElement(350, 250,
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
        {clickable: true, name: '2-blue'}
    )
    game.addElement(element2)

    const element3 = new GameElement(250, 350,
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
        {clickable: true, name: '3-green', level: 1}
    )
    game.addElement(element3)

    const element4 = new GameElement(350, 350,
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
        {clickable: true, name: '4-yellow'}
    )
    game.addElement(element4)
}
pogs()

// test display name of clicked object
function displayClickedName() {
    async function onClick(event) {
        const mouse = game.getMousePos(event)
        const clickedElement = await game.getElementAtPos(mouse)

        console.log(`Clicked element with name: "${clickedElement.name}"`)
    }

    canvas.addEventListener('click',(ev => onClick(ev)))
}
displayClickedName()

// test move clicked object to top
function moveClickedToTop() {
    async function onClick(event) {
        const mouse = game.getMousePos(event)
        const clickedElement = await game.getElementAtPos(mouse)

        const highestLevel = Math.max(...game.elements.map(el => el.level))

        clickedElement.level = highestLevel + 1
        game.updateLevels()
    }

    canvas.addEventListener('mousedown',(ev => onClick(ev)))
}
moveClickedToTop()

// uncomment this to test drawables
// const test = new GameElement(300,300,
//     [
//         new GameText('text',{level:10}),
//         new GameShape('rectangle',{width:100,height:50,fill:'red',level:0,rotation:0.5}),
//         new GameShape('rectangle',{width:100,height:100,stroke:'black',lineWidth:2,level:1}),
//         new GameText('level1',{level:1}),
//         new GameShape('oval',{rX:100,rY:100,fill:'red',level:1,rotation:0.2,stroke:'black',lineWidth:20}),
//         new GameShape('oval',{rX:50,rY:20,dx:200, dy:200,fill:'red',level:1,rotation:0.4}),
//         new GameShape('polygon',{name:'poly center',level:6, coords:[-100,-5,10,-10,30,30],fill:'red',rotation:0.3}),
//         new GameShape('polygon',{name:'poly right',level:6,dx:200, coords:[-100,-5,10,-10,30,30],fill:'red',rotation:0.3}),
//         new GameShape('line',{level:6, coords:[-100,-5,10,-10,30,30,200,-200],stroke:'black',lineWidth:50,}),
//         new GameShape('line',{level:7, coords:[-100,-5,10,-10,30,30,200,-200],stroke:'red',lineWidth:2,}),
//         new GameImage('frog','png',{name:'frog1',level:0,width:100,height:100,rotation:0.8}),
//         new GameImage('frog','png',{name:'frog2',level:0,dx:200,dy:200,width:200,height:100,rotation:-0.8}),
//         new GameGif('jump',{level:0,width:400,height:200,stagger:0}),
//         new GameGif('colors',{level:-1,stagger:10,width:600,height:600}),
//     ],
//     {clickable:true,name:"test",level:5}
// )
// game.addElement(test)


