var ball;
var springs = [];
var last_ms;

function setup() {
  createCanvas(500, 500);

  ball = new Ball(new Vector(width / 2, height / 2));
  springs.push(new Spring(ball, new Vector( width / 3, height / 2), 150, 10));
  springs.push(new Spring(ball, new Vector( 2 * width / 3, height / 2), 150, 10));
  last_ms = 0;
}

function draw() {
  background(color(10));

  // forces
  // friction
  ball.applyForce(ball.spd.scale(-0.1));
  // springs
  springs.forEach(function(el) {
    el.apply();
  });
  // gravity
  ball.applyForce(new Vector(0, 200).scale(ball.mass));
  // mouse drag
  if (mouseIsPressed) {
    var mouse = new Vector(mouseX, mouseY);
    ball.applyForce(mouse.sub(ball.pos));
    strokeWeight(1);
    stroke(100);
    line(mouse.x, mouse.y, ball.pos.x, ball.pos.y);
  }

  // animate & draw

  var current_ms = millis();
  var d_ms = current_ms - last_ms;
  last_ms = current_ms;
  ball.animate(d_ms / 1000.0);

  // springs
  springs.forEach(function(el) {
    el.draw();
  });
  ball.draw();
}
