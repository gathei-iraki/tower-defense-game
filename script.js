const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d'); //draws in 2d on the canvas
canvas.width = 900;
canvas.height = 600;

//global variables
const cellSize = 100; //size of each cell in grid(100 x100)
const cellGap = 3;
let numberOfResources = 300;
let enemiesInterval = 600;
let frame = 0;
let gameOver = false;
let score = 0;

const gameGrid = [];
const defenders = [];
const enemies = [];
const enemyPositions = [];
const projectiles =[];
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
class Projectile {
constructor(x,y){
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.power = 20;
    this.speed = 5;


}
update(){
    this.x += this.speed;

}
draw(){
    ctx.fillStyle = 'black' ;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2 );
    ctx.fill();
}
}

//to allow shooting if you have enough ammo
function handleProjectiles()    {
    for (let i = 0; i < projectiles.length; i++){
    projectiles[i].update();
    projectiles[i].draw();

//to reduce health of enemy once it collides with projectiles
for (let j =0; j < enemies.length; j++){
    if(enemies[j] && projectiles[i] && collision(projectiles[i], enemies[j])){
        enemies[j].health -= projectiles[i].power;

        //removing projectile from array after it hits enemy
        projectiles.splice(i, 1);
        i--;
    }

}


    //making sure projectiles are fired within the canvas
    if (projectiles[i] && projectiles[i].x > canvas.width - cellSize){
        projectiles.splice(i, 1);
        i--;

    }

    }
}


//defenders
class Defender{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.shooting = false;//shoot only when enemy is detected on row
        this.health = 100;
        this.projectiles = [];
        this.timer = 0;
    }
    draw(){
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'gold';
        ctx.font = '20px Orbitron';
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30);//to give health in whole numbers


    }
    update(){
        if (this.shooting){
            this.timer++;
            if (this.timer % 100 === 0){
                projectiles.push(new Projectile(this.x + 70, this.y + 50)); //to ensure lasers originate from the defender who fires them
    
            }
        }else {
            this.timer = 0;
        }
       
    }
}
//creating new defender on canvas after clicking
canvas.addEventListener('click', function(){
const gridPositonX = mouse.x - (mouse.x % cellSize) + cellGap;
const gridPositonY = mouse.y - (mouse.y % cellSize) + cellGap;
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
        defenders[i].update();

        //to check if defender has an enemy on its row
        if (enemyPositions.indexOf(defenders[i].y) !== -1){
            defenders[i].shooting = true;

        }else{
            defenders[i].shooting = false;

        }



        //checks collision between defender and any enemy object
        for (let j = 0; j < enemies.length; j++){
            if (defenders[i] && collision(defenders[i], enemies[j])){
                enemies[j].movement = 0; //setting enemy movement to 0
                defenders[i].health -= 0.2;

            }
            if (defenders[i] && defenders[i].health <= 0){
                defenders.splice(i, 1)
                i--;
                enemies[j].movement = enemies[j].speed;
            }
        }
    }
}
//enemies
class Enemy{
    constructor(verticalPosition){
      this.x = canvas.width;
      this.y = verticalPosition;
        this.width = cellSize;
        this.height = cellSize;
        this.speed = Math.random() * 0.2 + 0.4;
        this.movement = this.speed;
        this.health = 100;
        this.maxHealth = this.health;


    }
    update(){
    this.x -= this.movement;
    }
    draw(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '20px Orbitron';
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30);//to give health in whole numbers
    }
}

function handleEnemies(){
for (let i = 0; i < enemies.length; i++){
    enemies[i].update();
    enemies[i].draw();

    //ends game if enemies crossover to the other end
    if (enemies[i].x < 0){
        gameOver = true;
    }

    //remove enemy once health reaches 0
    if (enemies[i].health <= 0){
        let gainedResources = enemies[i].maxHealth/10;
        numberOfResources += gainedResources;
        score += gainedResources;
        const findThisIndex = enemyPositions.indexOf(enemies[i].y);
        enemyPositions.splice(findThisIndex, 1);
        enemies.splice(i, 1);
        i--;
    }

}
if (frame % enemiesInterval === 0){ //every 600 frames new enemy will be added
    let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize;
    enemies.push(new Enemy(verticalPosition));
    enemyPositions.push(verticalPosition);
    if(enemiesInterval > 120) enemiesInterval -= 50;
}
}
//utilities
function handleGameStatus(){
    ctx.fillStyle = 'gold';
    ctx.font = '30px Orbitron';
    ctx.fillText('Score: ' + score, 20, 40);
    ctx.fillText('Resources: ' + numberOfResources, 20, 80);
    if (gameOver){
        ctx.fillStyle = 'black';
        ctx.font = '90px Orbitron';
        ctx.fillText('GAME OVER', 135, 330);

    }
}


function animate() { //recursion to redraw the animation over and over
    ctx.clearRect(0, 0, canvas.width, canvas.height);//draws only current cell being hovered on
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0,constrolsBar.width, constrolsBar.height);
    handleGameGrid();
    handleDefenders();
    handleProjectiles();
    handleEnemies();
    handleGameStatus();
frame++;
   if(!gameOver) requestAnimationFrame(animate);
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