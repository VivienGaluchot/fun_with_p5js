var ball;
var spring_attach;
var last_ms;

function setup() {
  createCanvas(500, 500);

  spring_attach = new Vector( width / 2, 100);
  ball = new Ball(spring_attach.clone());
  last_ms = 0;
}

function draw() {
  background(color(10));

  // forces
  // friction
  ball.applyForce(ball.spd.scale(-0.1));
  // spring
  ball.applyForce(spring_attach.sub(ball.pos).scale(2));
  strokeWeight(1);
  stroke(150, 100, 100);
  line(spring_attach.x, spring_attach.y, ball.pos.x, ball.pos.y);
  // gravity
  ball.applyForce(new Vector(0, 200));
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

  ball.draw();
}
