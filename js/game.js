// Player Input

class PlayerInput {
  constructor(playerPaddle, gameStructureEngine) {

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
        // Pause or unpause the game with p key.
        case 32:
          gameStructureEngine.gameBegin();
          break;
        // Pause or unpause the game with p key.
        case 80:
          gameStructureEngine.pause();
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
    this.interactiveHeight = gameStructureEngine.interactiveHeight;
    this.width = 80;
    this.height = 14;
    this.maxSpeed = 10;
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
    ctx.shadowColor = "#979";
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
    this.size = 8;
    // this.maxSpeed = 4;
    this.speed = { x: 8, y: 8};

    // Define ball start location.
    this.position = { x: playableWidth / 3 , y: playableHeight / 1.4 };
  }
  // Color in the ball.
  draw(ctx) {
    ctx.shadowBlur = 2;
    ctx.shadowColor = "#f00";
    ctx.fillStyle = "#000";
    // ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
    ctx.arc(this.position.x, this.position.y, this.size, this.size, this.size * Math.PI);
    ctx.stroke();
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
    // Reverses motion if ball hits the ceiling.
    if(this.position.y < 0) {
      this.speed.y = -this.speed.y;
    }
    // Lower tries by 1 if ball hits the floor.
    if(this.position.y + this.size >= this.interactiveHeight) {
      this.gameStructureEngine.gameTries--;
    }

    // Reverses motion if ball hits player paddle.
    if(collisionDetection(this, this.gameStructureEngine.playerPaddle)) {
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
    this.width = 57;
    this.height = 30;

    this.destroyBrick = false;
  }
  // Color in the paddle.
  draw(ctx) {
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#09f";
    ctx.fillStyle = "#000";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  // Reverses ball direction if it hits a brick.
  update() {
    if(collisionDetection(this.gameStructureEngine.gameBall, this)) {
      this.gameStructureEngine.gameBall.speed.y = -this.gameStructureEngine.gameBall.speed.y;
      this.destroyBrick = true;
    }
  }
}


// Collision Detection

function collisionDetection(ball, gameObject) {
  // Reverses motion if ball hits player paddle.
  let ballBottom = ball.position.y + ball.size;
  let ballTop = ball.position.y;
  let objectTop = gameObject.position.y;
  let objectLeftSide = gameObject.position.x;
  let objectRightSide = gameObject.position.x + gameObject.width;
  let objectBottom = gameObject.position.y + gameObject.height;
  if(ballBottom >= objectTop
    && ballTop <= objectBottom
    && ball.position.x >= objectLeftSide
    && ball.position.x + ball.size <= objectRightSide) {
    return true;
  } else {
    return false;
  }
}


// Game Stages

function buildStage(gameStructureEngine, stage) {
  let bricks = [];

  stage.forEach((row, rowStructure) => {
    row.forEach((brick, brickStructure) => {
      if (brick === 1) {
        let position = {
          x: 62 * brickStructure,
          y: 70 + 55 * rowStructure
        };
        bricks.push(new Brick(gameStructureEngine, position));
      }
    });
  });
  return bricks;
}

const stage1 = [
  [0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
  [0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0]
];



//  Game Dynamics

const GAMESCREEN = {
  PAUSE: 0,
  ACTIVE: 1,
  MAINMENU: 2,
  GAMEOVER: 3
}

class GameStructure {
  //  Define ball attributes.
  constructor(interactiveWidth, interactiveHeight) {

    this.interactiveWidth = interactiveWidth;
    this.interactiveHeight = interactiveHeight;

    // Game begins at main menu.
    this.gameScreen = GAMESCREEN.MAINMENU;

    // Define an interactive player paddle.
    this.playerPaddle = new PlayerPaddle(this);

    // Define an interactive ball.
    this.gameBall = new Ball(this);

    // Define record for all gameObjects to interact.
    this.gameObjects = [];

    // Define number of tries left before game over.
    this.gameTries = 1;

    // Define player keyboard actions.
    new PlayerInput(this.playerPaddle, this);
  }
  gameBegin() {
    // Stop game stage from being reset when hitting space after game begins.
    if(this.gameScreen !== GAMESCREEN.MAINMENU) return;

    let bricks = buildStage(this, stage1);

    // Define gameObjects to be acted upon in bulk elsewhere.
    this.gameObjects = [this.playerPaddle,this.gameBall, ...bricks];

    // Change game screen to active game.
    this.gameScreen = GAMESCREEN.ACTIVE;
  }
  update(timeChange){

    // If game runs out of tries, go to game over screen.
    if (this.gameTries === 0) this.gameScreen = GAMESCREEN.GAMEOVER;

    if (
      this.gameScreen === GAMESCREEN.MAINMENU ||
      this.gameScreen === GAMESCREEN.PAUSE ||
      this.gameScreen === GAMESCREEN.GAMEOVER
    )
      return;

    this.gameObjects.forEach((object) => object.update(timeChange));
    this.gameObjects = this.gameObjects.filter(object => !object.destroyBrick);
  }
  draw(ctx) {
    // Set up ability to draw each object.
    this.gameObjects.forEach((object) => object.draw(ctx));

    if(this.gameScreen === GAMESCREEN.MAINMENU) {
      // Color screen when in main menu.
      ctx.rect(0, 0, this.interactiveWidth, this.interactiveHeight);
      ctx.fillStyle = "#fff";
      ctx.fill();

      // Game main menu text.
      ctx.font = "60px Georgia";
      ctx.fillStyle = "#055";
      ctx.textAlign = "center";
      ctx.shadowBlur = 3;
      ctx.shadowColor = "#06f";
      ctx.fillText(
        "Press Space to Begin",
        this.interactiveWidth / 2,
        this.interactiveHeight / 3
      );
    }

    if(this.gameScreen === GAMESCREEN.PAUSE) {
      // Darken game screen when paused.
      ctx.rect(0, 0, this.interactiveWidth, this.interactiveHeight);
      ctx.fillStyle = "rgba(255,128,90,0.7)";
      ctx.fill();

      // Game pause text.
      ctx.font = "70px Georgia";
      ctx.fillStyle = "#055";
      ctx.textAlign = "center";
      ctx.fillText(
        "Pause Game",
        this.interactiveWidth / 2,
        this.interactiveHeight / 2
      );
    }

    if(this.gameScreen === GAMESCREEN.GAMEOVER) {
      // Color screen when in game over.
      ctx.rect(0, 0, this.interactiveWidth, this.interactiveHeight);
      ctx.fillStyle = "rgba(0,0,40,0.8)";
      ctx.fill();

      // Game over text.
      ctx.font = "60px Georgia";
      ctx.fillStyle = "#f00";
      ctx.textAlign = "center";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#f00";
      ctx.fillText(
        "Game Over",
        this.interactiveWidth / 2,
        this.interactiveHeight / 2
      );
    }
  }
  // Toggles pause and active gamescreens.
  pause() {
    if (this.gameScreen === GAMESCREEN.PAUSE) {
      this.gameScreen = GAMESCREEN.ACTIVE;
    } else {
      this.gameScreen = GAMESCREEN.PAUSE;
    }
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
