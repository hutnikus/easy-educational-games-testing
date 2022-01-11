import {Game, GameElement, GameGif, GameImage, GameShape, GameText, Point} from "../modules/index.js"

const canvas = document.getElementById('game');
canvas.width = 600;
canvas.height = 600;

const game = new Game(canvas);

// let's try creating a drawing function
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

// let's try creating a drag and drop function
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

// test code to check if clicked inside an element
// canvas.addEventListener('mousemove',async (event) => await game.drawInside(event))

// let's try creating a button that outputs a text to console
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

// const test = new GameElement(300,300,
//     [
//         // new GameText('text',{level:10}),
//         // new GameShape('rectangle',{width:100,height:50,fill:'red',level:0,rotation:0.5}),
//         // new GameShape('rectangle',{width:100,height:100,stroke:'black',lineWidth:2,level:1}),
//         // new GameText('level1',{level:1}),
//         // new GameShape('oval',{rX:100,rY:100,fill:'red',level:1,rotation:0.2,stroke:'black',lineWidth:20}),
//         // new GameShape('oval',{rX:50,rY:20,dx:200, dy:200,fill:'red',level:1,rotation:0.4}),
//         // new GameShape('polygon',{name:'poly center',level:6, coords:[-100,-5,10,-10,30,30],fill:'red',rotation:0.3}),
//         // new GameShape('polygon',{name:'poly right',level:6,dx:200, coords:[-100,-5,10,-10,30,30],fill:'red',rotation:0.3}),
//         // new GameShape('line',{level:6, coords:[-100,-5,10,-10,30,30,200,-200],stroke:'black',lineWidth:50,}),
//         // new GameShape('line',{level:7, coords:[-100,-5,10,-10,30,30,200,-200],stroke:'red',lineWidth:2,}),
//         // new GameImage('frog','png',{name:'frog1',level:0,width:100,height:100,rotation:0.8}),
//         // new GameImage('frog','png',{name:'frog2',level:0,dx:200,dy:200,width:200,height:100,rotation:-0.8}),
//         // new GameGif('jump',{level:0,width:400,height:200,stagger:10}),
//         // new GameGif('colors',{level:-1,stagger:10,width:300,height:300}),
//     ],
//     {clickable:true,name:"test",level:5}
// )
// game.addElement(test)

const element1 = new GameElement(250,250,
    [
            new GameText('1',{level:2}),
            new GameShape('oval',{rX:100,rY:100,fill:'red',level:1,rotation:0.2,stroke:'black',lineWidth:20}),
    ],
    {clickable:true,name:'1',level:10}
)
game.addElement(element1)

const element2 = new GameElement(350,250,
    [
            new GameText('2',{level:10}),
            new GameShape('oval',{rX:100,rY:100,fill:'blue',level:1,rotation:0.2,stroke:'black',lineWidth:20}),
    ],
    {clickable:true,name:'2'}
)
game.addElement(element2)

const element3 = new GameElement(250,350,
    [
            new GameText('3',{level:10}),
            new GameShape('oval',{rX:100,rY:100,fill:'green',level:1,rotation:0.2,stroke:'black',lineWidth:20}),
    ],
    {clickable:true,name:'3',level:1}
)
game.addElement(element3)

const element4 = new GameElement(350,350,
    [
            new GameText('4',{level:10}),
            new GameShape('oval',{rX:100,rY:100,fill:'yellow',level:1,rotation:0.2,stroke:'black',lineWidth:20}),
    ],
    {clickable:true,name:'4'}
)
game.addElement(element4)
