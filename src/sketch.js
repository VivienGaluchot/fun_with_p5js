var demo;
var sketchElement;
var toolElement;
var checkbox;

var uiTest;

var playPause;
var playing;
function switchPlayPause() {
  if (playing) {
    noLoop();
    playing = false;
  } else {
    loop();
    playing = true;
  }
  setPlayPauseContent();
}
function setPlayPauseContent() {
  if (playing) {
    playPause.textContent = "Pause";
  } else {
    playPause.textContent = "Play";
  }
}

function setup() {
  playPause = document.getElementById('playPause');
  playPause.onclick = switchPlayPause;
  // loop();
  playing = true;
  setPlayPauseContent();

  sketchElement = document.getElementById('sketch-holder');
  toolElement = document.getElementById('toolbar');

  var canvas = createCanvas(sketchElement.offsetWidth - 10, sketchElement.offsetHeight - 10);
  canvas.parent(sketchElement);
  frameRate(60);

  checkbox = createCheckbox("Show forces");
  checkbox.parent(toolElement);

  demo = new Demo();
  
  uiTest = new DummyRectangleUiComponent(new Vector(10, 10), new Vector(150, 60));
  uiTest.childs.push(new DummyRectangleUiComponent(new Vector(15, 35), new Vector(90, 30)));
  uiTest.childs.push(new DummyRectangleUiComponent(new Vector(110, 35), new Vector(90, 30)));
}

function windowResized() {
  resizeCanvas(sketchElement.offsetWidth - 10, sketchElement.offsetHeight - 10);
}

function draw() {
  var mouse = new Vector(mouseX, mouseY);
  background(color(10));
  demo.draw(mouse, checkbox.checked());
  uiTest.draw();
}
