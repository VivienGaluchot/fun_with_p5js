var demo;
var sketchElement;
var toolElement;
var checkbox;

function setup() {
  sketchElement = document.getElementById('sketch-holder');
  toolElement = document.getElementById('toolbar');
  var canvas = createCanvas(sketchElement.offsetWidth - 10, sketchElement.offsetHeight - 10);
  canvas.parent(sketchElement);
  frameRate(60);

  checkbox = createCheckbox("Show forces");
  checkbox.parent(toolElement);

  demo = new Demo();
}

function windowResized() {
  resizeCanvas(sketchElement.offsetWidth - 10, sketchElement.offsetHeight - 10);
}

function draw() {
  background(color(10));
  demo.draw(checkbox.checked());
}
