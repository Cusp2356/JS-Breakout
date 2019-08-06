// Player paddle

class Player {
  //  Define player paddle attributes.
  constructor(interactiveWidth, interactiveHeight) {

    // Define paddle size and shape.
    this.width = 100;
    this.height = 14;

    // Define paddle start location.
    this.position = {
      x: interactiveWidth / 2 - this.width / 2,
      y: interactiveHeight - this.height - 20
    }
  }
  draw(ctx) {
    ctx.fillStyle = "#000";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  // Moves position based on change in time
  update(timeChange) {
    if(!timeChange) return;
    this.position.x += 10 / timeChange;
  }
}



// General dynamics

let canvas = document.getElementById("gameBox");
let ctx = canvas.getContext("2d");

// Define active game boundaries.
const playableWidth = 800;
const playableHeight = 600;

// Define and create an interactive player paddle.
let player = new Player(playableWidth, playableHeight);
player.draw(ctx);

let timePrevious = 0;

//  Update game animation every frame.
function gameUpdate(timeCurrent) {

  // Measure time passing for reference to redraw next frame changes.
  let timeChange = timeCurrent - timePrevious;
  timePrevious = timeCurrent;

  // Clear the screen every frame before drawing game screen frame changes.
  ctx.clearRect(0, 0, 800, 600);

  // Redraw player paddle.
  player.update(timeChange);
  player.draw(ctx);

  // Get time frame of reference for each browser animation frame.
  requestAnimationFrame(gameUpdate);
}

gameUpdate();
