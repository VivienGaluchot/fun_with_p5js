var demo;

function setup() {
  createCanvas(windowWidth - 10, windowHeight - 10);
  frameRate(60);
  demo = new Demo();
}

function windowResized() {
  resizeCanvas(windowWidth - 10, windowHeight - 10);
}

function draw() {
  background(color(10));
  demo.draw();
}
