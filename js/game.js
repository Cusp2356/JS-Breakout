// Player Input

class PlayerInput {
  constructor() {

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
  constructor(interactiveWidth, interactiveHeight) {

    // Define paddle size, shape, movement.
    this.interactiveWidth = interactiveWidth;
    this.width = 100;
    this.height = 14;
    this.maxSpeed = 4;
    this.speed = 0;

    // Define paddle start location.
    this.position = {
      x: interactiveWidth / 2 - this.width / 2,
      y: interactiveHeight - this.height - 20
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
  constructor(interactiveWidth, interactiveHeight) {

    // Define ball size, shape, attributes.
    this.width = 24;
    this.height = 24;
    // this.maxSpeed = 4;
    this.speed = { x: 0.1, y: 2 };

    // Define ball start location.
    this.position = { x: playableWidth / 2 , y: playableHeight / 2 };
  }
  // Color in the ball.
  draw(ctx) {
    ctx.shadowBlur = 30;
    ctx.shadowColor = "#000";
    ctx.fillStyle = "#000";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  // Moves position based on change in time.
  update(timeChange) {
    // Changes position based on defined speed for each frame.
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;
    // Stops motion if paddle hits edge of screen on the left.
    if(this.position.x < 0) this.position.x = 0;
    // Stops motion if paddle hits edge of screen on the right.
    if(this.position.x + this.width > this.interactiveWidth)
      this.position.x = this.interactiveWidth - this.width;
  }
}


// General Dynamics

let canvas = document.getElementById("gameBox");
let ctx = canvas.getContext("2d");

// Define active game boundaries.
const playableWidth = 800;
const playableHeight = 600;

// Define and create an interactive player paddle.
let playerPaddle = new PlayerPaddle(playableWidth, playableHeight);
playerPaddle.draw(ctx);

// Define and create an interactive ball.
let gameBall = new Ball(playableWidth, playableHeight);
gameBall.draw(ctx);

// Define player keyboard actions.
new PlayerInput(playerPaddle);

let timePrevious = 0;

//  Update game animation every frame.
function gameUpdate(timeCurrent) {

  // Measure time passing for reference to redraw next frame changes.
  let timeChange = timeCurrent - timePrevious;
  timePrevious = timeCurrent;

  // Clear the screen every frame before drawing game screen frame changes.
  ctx.clearRect(0, 0, playableWidth, playableHeight);

  // Redraw game pieces each frame.
  playerPaddle.update(timeChange);
  playerPaddle.draw(ctx);
  gameBall.update(timeChange);
  gameBall.draw(ctx);

  // Get time frame of reference for each browser animation frame.
  requestAnimationFrame(gameUpdate);
}

requestAnimationFrame(gameUpdate);
