const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d'); //draws in 2d on the canvas
canvas.width = 900;
canvas.height = 600;

//global variables
const cellSize = 100; //size of each cell in grid(100 x100)
const cellGap = 3;
const gameGrid = [];

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
    ctx.strokeStyle = 'black';
    ctx.strokeRect(this.x, this.y, this.width, this.height);
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
//enemies
//utilities

function animate() { //recursion to redraw the animation over and over
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0,constrolsBar.width, constrolsBar.height);
    handleGameGrid();
    requestAnimationFrame(animate);
}

animate();