var sketchElement;
var omni;

function setup() {
  sketchElement = document.getElementById('sketch-holder');

  var canvas = createCanvas(sketchElement.offsetWidth, sketchElement.offsetHeight);
  canvas.parent(sketchElement);
  frameRate(60);

  omni = new OmniUiComponent();

  var pe = new PhysicEnvironment();
  omni.children.push(pe);

  var ball = new Ball(new Vector(width / 2, height / 2));
  ball.mass = 1;
  ball.past_stroke = color(100, 100, 150);
  pe.children.push(ball);
  pe.forces.push(new LocalFriction(ball, 1));
  pe.forces.push(new Spring(ball, new Localised(new Vector( width / 2, height / 2)), 50, 25));
  pe.forces.push(new LocalGravity(ball, new Vector(0, 100)));
}

function windowResized() {
  resizeCanvas(sketchElement.offsetWidth, sketchElement.offsetHeight);
}

function draw() {
  // inputs : height, width, mouseX, mouseY, mouseIsPressed
  var mouse = new Vector(mouseX, mouseY);
  background(color(10));

  omni.update(mouse, mouseIsPressed);
  omni.draw();
}
