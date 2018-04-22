var env;
var mouseForce;

function setup() {
  createCanvas(500, 500);

  env = new PhysicEnvironment();

  var ball = new Ball(new Vector(width / 2, height / 2));
  env.mobiles.push(ball);

  var gravity = new Gravity(ball, new Vector(0, 100));
  gravity.visible = false;
  env.forces.push(gravity);

  var friction = new Friction(ball, 0.1);
  friction.visible = false;
  env.forces.push(friction);

  env.forces.push(new Spring(ball, new Vector( width / 3, height / 2), 150, 10));
  env.forces.push(new Spring(ball, new Vector( 2 * width / 3, height / 2), 150, 10));

  mouseForce = new Spring(ball, new Vector(), 0, 1);
  mouseForce.enabled = false;
  mouseForce.stroke = color(100);
  mouseForce.strokeWeight = 1;
  env.forces.push(mouseForce);
}

function draw() {
  background(color(10));

  if (mouseIsPressed) {
    var mouse = new Vector(mouseX, mouseY);
    mouseForce.attachment = mouse;
    mouseForce.enabled = true;
  } else {
    mouseForce.enabled = false;
  }
  env.draw();
}
