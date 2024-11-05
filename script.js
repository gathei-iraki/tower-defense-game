const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d'); //draws in 2d on the canvas
canvas.width = 900;
canvas.height = 600;

//global variables
const cellSize = 100; //size of each cell in grid(100 x100)
const cellGap = 3;
const gameGrid = [];
const defenders = [];
let numberOfResources = 300;
//mouse- drawing cells when mouse hovers over it
const mouse ={
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
}
let canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', function(e){
   mouse.x = e.x - canvasPosition.left;
   mouse.y = e.y - canvasPosition.top;
});

canvas.addEventListener('mouseleave', function(){
    mouse.y = undefined;
    mouse.y = undefined;
})

//gameboard
const constrolsBar = {
    
    width: canvas.width,
    height: cellSize,
}
class Cell{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
}
draw(){ //draws the cell as a black rectangle on the canvas
    if(mouse.x && mouse.y && collision(this, mouse)){
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    
    }
}

function createGrid(){
    for(let y = cellSize; y < canvas.height; y += cellSize){
        for(let x = 0; x < canvas.width; x += cellSize){
            gameGrid.push(new Cell(x, y));
            
        }
}
}
createGrid();

function handleGameGrid(){
    for (let i = 0; i < gameGrid.length; i++){
        gameGrid[i].draw();
    }
}

//projectiles
//defenders
class Defender{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
        this.shooting = false;//shoot only when enemy is detected on row
        this.health = 100;
        this.projectiles = [];
        this.timer = 0;
    }
    draw(){
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'gold';
        ctx.font = '20px Arial';
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30);//to give health in whole numbers


    }
}
//creating new defender on canvas after clicking
canvas.addEventListener('click', function(){
const gridPositonX = mouse.x - (mouse.x % cellSize);
const gridPositonY = mouse.y - (mouse.y % cellSize);
if (gridPositonY < cellSize) return;//to ensure you cant add a defender on the top blue spot
//to avoid placing a defender on top of another
for (let i = 0; i < defenders.length; i++){
    if (defenders[i].x === gridPositonX && defenders[i].y === gridPositonY)
        return;
}
let defenderCost = 100;
if (numberOfResources >= defenderCost){
    defenders.push(new Defender(gridPositonX, gridPositonY));
    numberOfResources -= defenderCost;
}


}) ;
function handleDefenders(){
    for (let i = 0; i < defenders.length; i++){
        defenders[i].draw();
    }
}
//enemies
//utilities
function handleGameStatus(){
    ctx.fillStyle = 'gold';
    ctx.font = '30px Arial';
    ctx.fillText('Resources: ' + numberOfResources, 20, 55);
}


function animate() { //recursion to redraw the animation over and over
    ctx.clearRect(0, 0, canvas.width, canvas.height);//draws only current cell being hovered on
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0,constrolsBar.width, constrolsBar.height);
    handleGameGrid();
    handleDefenders();
    handleGameStatus();
    requestAnimationFrame(animate);
}

animate();

function collision(first, second){
    if(
        !(first.x > second.x + second.width ||
        first.x + first.width < second.x ||
        first.y > second.y + second.height ||   
        first.y + first.height < second.y)

        ) {
            return true;
        };
    
};