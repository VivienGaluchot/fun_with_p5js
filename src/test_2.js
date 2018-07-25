var sketchElement;
var userParameters = {};
var omni;

function fillActionners(toolElement) {
  userParameters.bounceLabel = createSpan("bounce");
  userParameters.bounceLabel.parent(toolElement);
  userParameters.bounce = createSlider(0, 100, 80);
  userParameters.bounce.parent(toolElement);

  userParameters.electricChargeLabel = createSpan("electricCharge");
  userParameters.electricChargeLabel.parent(toolElement);
  userParameters.electricCharge = createSlider(0, 200, 10);
  userParameters.electricCharge.parent(toolElement);

  userParameters.checkbox = createCheckbox("electromagnetic force");
  userParameters.checkbox.parent(toolElement);
}

function fillPhysicEnvironment(pe, width, height) {
  pe.clean();
  var n = 6;
  var fef;
  if (userParameters.checkbox.checked()) {
    fef = new FakeElectricField();
    pe.forces.push(fef);
  }
  for (var i = 1; i < n; i++) {
    for (var j = 1; j < n; j++) {
      var pos = new Vector(width * i / n, height * j / n);
      var a = new Ball(pos);
      a.bounce = userParameters.bounce.value() / 100;
      a.electricCharge = userParameters.electricCharge.value() / 10;
      pe.children.push(a);
      if (userParameters.checkbox.checked()) {
        fef.children.push(a);
      }
    }
  }
}

function setup() {
  sketchElement = document.getElementById('sketch-holder');
  toolElement = document.getElementById('toolbar');
  var canvas = createCanvas(sketchElement.offsetWidth, sketchElement.offsetHeight);
  canvas.parent(sketchElement);
  frameRate(60);

  fillActionners(toolElement);

  omni = new OmniUiComponent();
  omni.centerLocation = new Vector(width / 2, height / 2);

  var pe = new PhysicEnvironment();
  fillPhysicEnvironment(pe, width, height);
  omni.children.push(pe);

  button = new DummyRectangleUiComponent(new Vector(10, 10), new Vector(80, 25));
  button.locked = true;
  button.text = "Reset";
  button.clickEvent = function(mouse) {
    fillPhysicEnvironment(pe, width, height);
  }
  omni.children.push(button);

  loop();
}

function windowResized() {
  if (sketchElement != null) {
    resizeCanvas(sketchElement.offsetWidth, sketchElement.offsetHeight);
    omni.centerLocation.set(width / 2, height / 2);
  }
}

function draw() {
  if (sketchElement != null) {
    // inputs : height, width, mouseX, mouseY, mouseIsPressed
    var mouse = new Vector(mouseX, mouseY);
    clear();

    omni.update(mouse, mouseIsPressed);
    omni.draw();
  }
}
