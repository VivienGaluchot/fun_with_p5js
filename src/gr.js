var sketchElement;
var omni;

var db = Object.freeze({
  categories: [
    { name: "cat1",
      children: [
        {name: "cat1-ch1", desc: "cat1-ch1-desc"},
        {name: "cat1-ch2", desc: "cat1-ch2-desc"}
      ]
    }, { name: "cat2",
      children: [
        {name: "cat2-ch1", desc: "cat2-ch1-desc"},
        {name: "cat2-ch2", desc: "cat2-ch2-desc"},
        {name: "cat2-ch3", desc: "cat2-ch3-desc"}
      ]
    }, { name: "cat4",
      children: [
        {name: "cat4-ch1", desc: "cat4-ch1-desc"},
        {name: "cat4-ch2", desc: "cat4-ch2-desc"},
        {name: "cat4-ch3", desc: "cat4-ch3-desc"}
      ]
    }
  ]
});

// TODO use force fiel or spring between all pair of balls to avoid crossed
// stable configuration with 4 balls
function fillPhysicEnvironment(pe, db) {
  var LinkProp = Object.freeze({
    centerCat: {l: 80, i: 50},
    centerChild: {l: 160, i: 10},
    catChild: {l: 60, i: 10},
    catCat: {l: 120, i: 50},
    childChild: {l: 50, i: 10}
  });
  function link(a, b, prop) {
    var link = new SpringMobileMobile(a, b, prop.l, prop.i);
    link.drawSymbol = function() {
      strokeWeight(2);
      stroke(color(50));
      line(this.forceAtoB.mobile.pos.x, this.forceAtoB.mobile.pos.y,
        this.forceBtoA.mobile.pos.x, this.forceBtoA.mobile.pos.y);
    }
    return link;
  }
  function ghostLink(a, b, prop) {
    var link = new SpringMobileMobile(a, b, prop.l, prop.i);
    link.drawSymbol = function() {}
    return link;
  }

  var centerBall = new Ball(new Vector(width / 2, height / 2));
  centerBall.mass = 5;
  centerBall.shape.rad = 20;
  pe.children.push(centerBall);
  pe.forces.push(new LocalFriction(centerBall, 5));
  var catBall = null;
  var lastCatBall = null;
  var firstCatBall = null;
  db.categories.forEach(function(categorie) {
    var name = categorie.name;
    catBall = new Ball(new Vector(random(width), random(height)));
    catBall.shape.rad = 15;
    pe.children.push(catBall);
    pe.forces.push(new LocalFriction(catBall, 3));
    pe.forces.push(link(centerBall, catBall, LinkProp.centerCat));
    if (lastCatBall != null)
      pe.forces.push(ghostLink(lastCatBall, catBall, LinkProp.catCat));
    var childBall = null;
    var lastChildBall = null;
    var firstChildBall = null;
    categorie.children.forEach(function(child) {
      childBall = new Ball(new Vector(random(width), random(height)));
      pe.children.push(childBall);
      pe.forces.push(new LocalFriction(childBall, 0.5));
      pe.forces.push(link(catBall, childBall, LinkProp.catChild));
      pe.forces.push(ghostLink(centerBall, childBall, LinkProp.centerChild));
      if (lastChildBall != null)
        pe.forces.push(ghostLink(childBall, lastChildBall, LinkProp.childChild));
      lastChildBall = childBall;
      if (firstChildBall == null)
        firstChildBall = childBall;
    });
    pe.forces.push(ghostLink(childBall, firstChildBall, LinkProp.childChild));
    lastCatBall = catBall;
    if (firstCatBall == null)
      firstCatBall = catBall;
  });
  pe.forces.push(ghostLink(catBall, firstCatBall, LinkProp.catCat));
}

function setup() {
  sketchElement = document.getElementById('sketch-holder');

  var canvas = createCanvas(sketchElement.offsetWidth, sketchElement.offsetHeight);
  canvas.parent(sketchElement);
  frameRate(60);

  omni = new OmniUiComponent();

  var pe = new PhysicEnvironment();
  omni.children.push(pe);

  fillPhysicEnvironment(pe, db);
}

function windowResized() {
  resizeCanvas(sketchElement.offsetWidth, sketchElement.offsetHeight);
}

function draw() {
  // inputs : height, width, mouseX, mouseY, mouseIsPressed
  var mouse = new Vector(mouseX, mouseY);
  clear();

  omni.update(mouse, mouseIsPressed);
  omni.draw();
}
