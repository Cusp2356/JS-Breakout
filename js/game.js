// Player Input

class PlayerInput {
  constructor(playerPaddle) {

    document.addEventListener("keydown", event => {
      switch(event.keyCode) {
        // Left key moves paddle left.
        case 37:
          playerPaddle.motionLeft();
          break;
        // Right key moves paddle right.
        case 39:
          playerPaddle.motionRight();
          break;
      }
    });

    document.addEventListener("keyup", event => {
      switch(event.keyCode) {
        // Releasing left key halts left movement.
        case 37:
          if(playerPaddle.speed < 0)
            playerPaddle.motionStop();
          break;
        // Releasing right key halts right movement.
        case 39:
          if(playerPaddle.speed > 0)
            playerPaddle.motionStop();
          break;
      }
    });
  }
}


// Player Paddle

class PlayerPaddle {
  //  Define player paddle attributes.
  constructor(gameStructureEngine) {

    // Define paddle size, shape, movement.
    this.interactiveWidth = gameStructureEngine.interactiveWidth;
    this.width = 100;
    this.height = 14;
    this.maxSpeed = 4;
    this.speed = 0;

    // Define paddle start location.
    this.position = {
      x: gameStructureEngine.interactiveWidth / 2 - this.width / 2,
      y: gameStructureEngine.interactiveHeight - this.height - 20
    }
  }
  // Defines player motion left.
  motionLeft() {
    this.speed = -this.maxSpeed;
  }
  // Defines player motion right.
  motionRight() {
    this.speed = this.maxSpeed;
  }
  // Defines player motion halt.
  motionStop() {
    this.speed = 0;
  }
  // Color in the paddle.
  draw(ctx) {
    ctx.shadowBlur = 3;
    ctx.shadowColor = "#000";
    ctx.fillStyle = "#000";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  // Moves position based on change in time.
  update(timeChange) {
    // Changes position based on defined speed for each frame.
    this.position.x += this.speed;
    // Stops motion if paddle hits edge of screen on the left.
    if(this.position.x < 0) this.position.x = 0;
    // Stops motion if paddle hits edge of screen on the right.
    if(this.position.x + this.width > this.interactiveWidth)
      this.position.x = this.interactiveWidth - this.width;
  }
}


// Ball

class Ball {
  //  Define ball attributes.
  constructor(gameStructureEngine) {

    this.interactiveWidth = gameStructureEngine.interactiveWidth;
    this.interactiveHeight = gameStructureEngine.interactiveHeight;
    this.gameStructureEngine = gameStructureEngine;

    // Define ball size.
    this.size = 24;
    // this.maxSpeed = 4;
    this.speed = { x: 5, y: 3};

    // Define ball start location.
    this.position = { x: playableWidth / 2 , y: playableHeight / 2 };
  }
  // Color in the ball.
  draw(ctx) {
    ctx.shadowBlur = 30;
    ctx.shadowColor = "#f00";
    ctx.fillStyle = "#000";
    ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
  }
  // Moves position based on change in time.
  update(timeChange) {
    // Changes position based on defined speed for each frame.
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;
    // Reverses motion if ball hits either wall.
    if(this.position.x + this.size > this.interactiveWidth || this.position.x < 0) {
      this.speed.x = -this.speed.x;
    }
    // Reverses motion if ball hits the floor or ceiling.
    if(this.position.y + this.size > this.interactiveHeight || this.position.y < 0) {
      this.speed.y = -this.speed.y;
    }
    // Reverses motion if ball hits player paddle.
    let ballBottom = this.position.y + this.size;
    let playerPaddleTop = this.gameStructureEngine.playerPaddle.position.y;
    let playerPaddleLeftSide = this.gameStructureEngine.playerPaddle.position.x;
    let playerPaddleRightSide = this.gameStructureEngine.playerPaddle.position.x
                                + this.gameStructureEngine.playerPaddle.width;
    if(ballBottom >= playerPaddleTop
      && this.position.x >= playerPaddleLeftSide
      && this.position.x + this.size <= playerPaddleRightSide) {
      this.speed.y = -this.speed.y;
      this.position.y = this.gameStructureEngine.playerPaddle.position.y - this.size;
    }
  }
}


// Brick

class Brick {
  //  Define player paddle attributes.
  constructor(gameStructureEngine, position) {

    this.gameStructureEngine = gameStructureEngine;
    this.position = position;

    // Define brick size, shape.
    this.width = 50;
    this.height = 25;
  }
  // Color in the paddle.
  draw(ctx) {
    ctx.shadowBlur = 100;
    ctx.shadowColor = "#09f";
    ctx.fillStyle = "#000";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  //
  update() {

  }
}


// Game Stages

function buildStage(gameStructureEngine, stage) {
  let bricks = [];

  stage.forEach((row, rowStructure) => {
    row.forEach((brick, brickStructure) => {
      if (brick === 1) {
        let position = {
          x: 68 * brickStructure,
          y: 60 + 30 * rowStructure
        };
        bricks.push(new Brick(gameStructureEngine, position));
      }
    });
  });
  return bricks;
}

const stage1 = [
  [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
  [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];



//  Game Dynamics

class GameStructure {
  //  Define ball attributes.
  constructor(interactiveWidth, interactiveHeight) {

    this.interactiveWidth = interactiveWidth;
    this.interactiveHeight = interactiveHeight;

  }
  gameBegin() {

    // Define an interactive player paddle.
    this.playerPaddle = new PlayerPaddle(this);

    // Define an interactive ball.
    this.gameBall = new Ball(this);

    let bricks = buildStage(this, stage1);

    // Define gameObjects to be acted upon in bulk elsewhere.
    this.gameObjects = [this.playerPaddle,this.gameBall, ...bricks];

    // Define player keyboard actions.
    new PlayerInput(this.playerPaddle);
  }
  update(timeChange){
    this.gameObjects.forEach((object) => object.update(timeChange));
  }
  draw(ctx) {
    this.gameObjects.forEach((object) => object.draw(ctx));
  }
}


// Game Engine

let canvas = document.getElementById("gameBox");
let ctx = canvas.getContext("2d");

// Define active game boundaries.
const playableWidth = 800;
const playableHeight = 600;

// Brings in dynamics between different game objects.
let gameStructureEngine = new GameStructure(playableWidth, playableHeight);
gameStructureEngine.gameBegin();

let timePrevious = 0;

//  Update game animation every frame.
function gameUpdate(timeCurrent) {

  // Measure time passing for reference to redraw next frame changes.
  let timeChange = timeCurrent - timePrevious;
  timePrevious = timeCurrent;

  // Clear the screen every frame before drawing game screen frame changes.
  ctx.clearRect(0, 0, playableWidth, playableHeight);

  // Redraw game pieces each frame.
  gameStructureEngine.update(timeChange);
  gameStructureEngine.draw(ctx);

  // Get time frame of reference for each browser animation frame.
  requestAnimationFrame(gameUpdate);
}

requestAnimationFrame(gameUpdate);
