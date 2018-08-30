var sketchElement;
var omni;

var db = Object.freeze({
  categories: [{
    name: "cat1",
    hue: 1 / 6,
    children: [{
        name: "cat1-ch1",
        desc: "cat1-ch1-desc"
      },
      {
        name: "cat1-ch2",
        desc: "cat1-ch2-desc"
      }
    ]
  }, {
    name: "cat2",
    hue: 2 / 6,
    children: [{
        name: "cat2-ch1",
        desc: "cat2-ch1-desc"
      },
      {
        name: "cat2-ch2",
        desc: "cat2-ch2-desc"
      },
      {
        name: "cat2-ch3",
        desc: "cat2-ch3-desc"
      }
    ]
  }, {
    name: "cat3",
    hue: 3 / 6,
    children: [{
        name: "cat3-ch1",
        desc: "cat3-ch1-desc"
      },
      {
        name: "cat3-ch2",
        desc: "cat3-ch2-desc"
      },
      {
        name: "cat3-ch3",
        desc: "cat3-ch3-desc"
      },
      {
        name: "cat3-ch4",
        desc: "cat3-ch4-desc"
      },
      {
        name: "cat3-ch5",
        desc: "cat3-ch5-desc"
      }
    ]
  }, {
    name: "cat4",
    hue: 4 / 6,
    children: [{
        name: "cat4-ch1",
        desc: "cat4-ch1-desc"
      },
      {
        name: "cat4-ch2",
        desc: "cat4-ch2-desc"
      },
      {
        name: "cat4-ch3",
        desc: "cat4-ch3-desc"
      }
    ]
  }, {
    name: "cat5",
    hue: 5 / 6,
    children: [{
        name: "cat5-ch1",
        desc: "cat5-ch1-desc"
      },
      {
        name: "cat5-ch2",
        desc: "cat5-ch2-desc"
      },
      {
        name: "cat5-ch3",
        desc: "cat5-ch3-desc"
      }
    ]
  }, {
    name: "cat6",
    hue: 6 / 6,
    children: [{
        name: "cat6-ch1",
        desc: "cat6-ch1-desc"
      },
      {
        name: "cat6-ch2",
        desc: "cat6-ch2-desc"
      },
      {
        name: "cat6-ch3",
        desc: "cat6-ch3-desc"
      }
    ]
  }]
});

// TODO use force fiel or spring between all pair of balls to avoid crossed
// stable configuration with 4 balls
function fillPhysicEnvironment(pe, db) {
  var LinkProp = Object.freeze({
    centerCat: {
      l: 80,
      i: 50
    },
    catChild: {
      l: 60,
      i: 10
    }
  });

  function pushBall(rad, mass, electricCharge, friction) {
    var ball = new Ball(new Vector(random(width), random(height)));
    ball.pastMaxLength = 0;
    ball.shape.rad = rad;
    ball.mass = mass;
    ball.electricCharge = electricCharge;
    pe.children.push(ball);
    fef.children.push(ball);
    pe.forces.push(new LocalFriction(ball, friction));
    return ball;
  }

  function link(a, b, prop, color) {
    var link = new SpringMobileMobile(a, b, prop.l, prop.i);
    link.drawSymbol = function() {
      strokeWeight(2);
      stroke(color);
      line(this.forceAtoB.mobile.pos.x, this.forceAtoB.mobile.pos.y,
        this.forceBtoA.mobile.pos.x, this.forceBtoA.mobile.pos.y);
    }
    return link;
  }

  var fef = new FakeElectricField();
  pe.forces.push(fef);

  var centerBall = pushBall(20, 5, 5, 5);
  centerBall.stroke.setAll(color(100));
  var centerSpring = new Spring(centerBall, new Localised(omni.centerLocation), 0, 50);
  centerSpring.visible = false;
  pe.forces.push(centerSpring);
  db.categories.forEach(function(categorie) {
    var name = categorie.name;
    var catBall = pushBall(15, 3, 3, 3);
    var catStroke = hslToRgb(categorie.hue, 0.7, 0.4);
    var catFill = hslToRgb(categorie.hue, 0.4, 0.85);
    var catFillHovered = hslToRgb(categorie.hue, 0.7, 0.7);
    catBall.stroke.setAll(color(catStroke[0], catStroke[1], catStroke[2]));
    catBall.fill.setAll(color(catFill[0], catFill[1], catFill[2]));
    catBall.fill.set(UiComState.Hovered, catFillHovered);
    catBall.fill.set(UiComState.Pressed, catFillHovered);
    catBall.fill.set(UiComState.PressedMissed, catFillHovered);
    pe.forces.push(link(centerBall, catBall, LinkProp.centerCat, catStroke));
    categorie.children.forEach(function(child) {
      var childBall = pushBall(10, 1, 1, 0.5);
      childBall.stroke.setAll(color(catStroke[0], catStroke[1], catStroke[2]));
      childBall.fill.setAll(color(catFill[0], catFill[1], catFill[2]));
      childBall.fill.set(UiComState.Hovered, catFillHovered);
      childBall.fill.set(UiComState.Pressed, catFillHovered);
      childBall.fill.set(UiComState.PressedMissed, catFillHovered);
      pe.forces.push(link(catBall, childBall, LinkProp.catChild, catStroke));
    });
  });
}

function setup() {
  sketchElement = document.getElementById('sketch-holder');
  if (sketchElement == null) {
    noLoop();
    return;
  } else {
    var canvas = createCanvas(sketchElement.offsetWidth, sketchElement.offsetHeight);
    canvas.parent(sketchElement);
    frameRate(60);

    omni = new OmniUiComponent();
    omni.centerLocation = new Vector(width / 2, height / 2);

    var pe = new PhysicEnvironment();
    omni.children.push(pe);

    button = new DummyRectangleUiComponent(new Vector(10, 10), new Vector(80, 25));
    button.locked = true;
    button.text = "Stabilize";
    button.clickEvent = function(mouse) {
      pe.reachStability(5);
    }
    omni.children.push(button);

    fillPhysicEnvironment(pe, db);
    pe.reachStability(5);
    loop();
  }
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
