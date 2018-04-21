var ball;
var gravity;
var springs = [];

var last_ms;

function setup() {
  createCanvas(500, 500);

  ball = new Ball(new Vector(width / 2, height / 2));
  gravity = new Gravity(ball, new Vector(0, 100));
  springs.push(new Spring(ball, new Vector( width / 3, height / 2), 150, 10));
  springs.push(new Spring(ball, new Vector( 2 * width / 3, height / 2), 150, 10));
  last_ms = 0;
}

function draw() {
  background(color(10));

  // apply forces

  // friction
  ball.applyForce(ball.spd.scale(-0.1));
  // springs
  springs.forEach(function(el) {
    el.apply();
  });
  // mouse drag
  if (mouseIsPressed) {
    var mouse = new Vector(mouseX, mouseY);
    mouse_spring = new Spring(ball, mouse, 0, 1);
    mouse_spring.stroke = color(100);
    mouse_spring.strokeWeight = 1;
    mouse_spring.apply();
    mouse_spring.draw();
  }
  // gravity
  gravity.apply();

  // animate
  var current_ms = millis();
  var d_ms = current_ms - last_ms;
  last_ms = current_ms;
  ball.animate(d_ms / 1000.0);

  // draw
  springs.forEach(function(el) {
    el.draw();
  });
  // gravity.draw();
  ball.draw();
}
