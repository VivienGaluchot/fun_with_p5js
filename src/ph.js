// TODO use workers

class PhysicEnvironment extends AbstractUiComponent {
  constructor() {
    super(null);

    this.forces = [];
    this.lastDrawMs = 0;
  }

  reachStability(maxSpeed) {
    console.log("ReachingStability");
    var next = true;
    var step = 0;
    while(next) {
      if (step % 200 == 0)
        console.log("step", step)
      this.animate(0.1);
      next = this.children.find(function(child) {
        return child.spd.length() > maxSpeed;
      });
      step++;
      if (step > 10000)
        next = false;
    }
    console.log("Done");
  }

  drawComponent() {
    // draw forces
    this.forces.forEach(function(force) {
      force.drawComponent();
    });
  }

  // mouse : Vector
  // pressed : boolean
  update(mouse, pressed) {
    // update ui components
    super.update(mouse, pressed);

    // animate
    var currentTimeInMs = millis();
    var timeDeltaInMs = currentTimeInMs - this.lastDrawMs;
    this.lastDrawMs = currentTimeInMs;
    var timeDeltaInS = timeDeltaInMs / 1000;
    if (timeDeltaInS > 0.1) {
      console.log("warning : time lost", timeDeltaInS);
      timeDeltaInS = 0.1;
    }
    this.animate(timeDeltaInS);
  }

  // timeDeltaInS : number
  animate(timeDeltaInS) {
    // apply forces
    var superEnv = this;
    this.forces.forEach(function(force) {
      if (force.enabled) {
        force.apply();
      }
    });
    // animate mobiles
    this.children.forEach(function(mobile) {
      mobile.animate(timeDeltaInS);
    });
  }
}


// ---- Forces ----

class AbstractForce {
  constructor() {
    // physic
    this.enabled = true;
    // style
    this.visible = true;
    this.vectorVisible = false;
    this.stroke = color(75);
    this.strokeWeight = 1;
  }

  drawSymbol() {}
  drawVector() {}

  drawComponent() {
    if (this.enabled && this.vectorVisible) {
      this.drawVector();
    }
    if (this.enabled && this.visible) {
      this.drawSymbol();
    }
  }
}

// Generate a force field applied to some mombiles
class GlobalForce extends AbstractForce {
  constructor() {
    super();
    // physic
    this.children = [];
  }

  // to override
  getForce(mobile) {
    return new Vector();
  }

  apply() {
    var superForce = this;
    this.children.forEach(function(mobile){
      mobile.applyForce(superForce.getForce(mobile));
    });
  }

  drawVector() {
    strokeWeight(this.strokeWeight);
    stroke(this.stroke);
    var step = 40;
    var loc = new Localised();
    for (loc.pos.x = 0; loc.pos.x < width; loc.pos.x += step) {
      for (loc.pos.y = 0; loc.pos.y < height; loc.pos.y += step) {
        var f = this.getForce(loc);
        var fEnd = f.add(loc.pos);
        drawArrow(loc.pos, fEnd, 5);
      }
    }
  }
}

// TODO : make a true gravity, mobiles attracted to mobiles
class GlobalGravity extends GlobalForce {
  // vector : Vector
  constructor(vector = new Vector()) {
    super();
    // physic
    this.vector = vector;
    // style
    this.stroke = color(50, 100, 200);
  }

  getForce(mobile) {
    if (mobile.mass == null)
      return this.vector;
    return this.vector.scale(mobile.mass);
  }
}

// TODO Compute with electric fields
class FakeElectricField extends GlobalForce {
  // vector : Vector
  constructor(vector = new Vector()) {
    super();
  }

  coulomb(pa, pb, qa, qb) {
    var ba = pa.sub(pb);
    var baLength = ba.length();
    ba.normalizeInplace();
    var scale = 10000 * (qa * qb) / (baLength * baLength);
    return ba.scaleInplace(scale);
  }

  getForce(mobile) {
    if (mobile.electricCharge == null)
      return new Vector();
    var fAccumulator = new Vector();
    var superForce = this;
    this.children.forEach(function(child) {
      if (mobile != child) {
        fAccumulator.addInplace(superForce.coulomb(mobile.pos, child.pos, mobile.electricCharge, child.electricCharge));
      }
    });
    return fAccumulator;
  }

  drawVector() {
    strokeWeight(this.strokeWeight);
    stroke(this.stroke);
    var superForce = this;
    this.children.forEach(function(child) {
      var f = superForce.getForce(child);
      var fEnd = f.add(child.pos);
      drawArrow(child.pos, fEnd, 5);
    });
  }
}

class LocalForce extends AbstractForce {
  // mobile : object
  //         attributes pos : vector, spd : vector, mass : number
  //         function applyForce(vector)
  constructor(mobile) {
    super();
    // physic
    this.mobile = mobile;
  }

  // to override
  getForce() {
    return new Vector();
  }

  apply() {
    this.mobile.applyForce(this.getForce());
  }

  drawVector() {
    strokeWeight(this.strokeWeight);
    stroke(this.stroke);
    var f = this.getForce();
    var fEnd = f.add(this.mobile.pos);
    drawArrow(this.mobile.pos, fEnd, 5);
  }
}

class LocalGravity extends LocalForce {
  // mobile : object with attribute mass : number
  // vector : Vector
  constructor(mobile, vector = new Vector()) {
    super(mobile);
    // physic
    this.vector = vector;
    // style
    this.stroke = color(50, 100, 200);
  }

  getForce() {
    return this.vector.scale(this.mobile.mass);
  }
}

class LocalFriction extends LocalForce {
  // mobile : object with attribute mass : number
  // intensity : number
  constructor(mobile, intensity) {
    super(mobile);
    // physic
    this.intensity = intensity;
    // style
    this.stroke = color(150, 200, 100);
  }

  getForce() {
    return this.mobile.spd.scale(-1 * this.intensity);
  }
}

class Spring extends LocalForce {
  // mobile : object with attribute pos : Vector
  // attachement : object with attribute pos : Vector
  // tension : number
  constructor(mobile, attachment = new Localised(), length, tension = 1) {
    super(mobile);
    // physic
    this.attachment = attachment;
    this.length = length;
    this.tension = tension;
    // style
    this.strokeWeight = 1;
    this.stroke = color(200, 100, 150);
    this.width = 10;
  }

  // return : Vector
  getForce() {
    var deltaPos = this.attachment.pos.sub(this.mobile.pos);
    var deltaLength = deltaPos.length() - this.length;
    return deltaPos.normalize().scale(deltaLength * this.tension);
  }

  drawSymbol() {
    strokeWeight(this.strokeWeight);
    stroke(this.stroke);
    drawZwigs(this.attachment.pos, this.mobile.pos, Math.max(this.length / this.width, 2), this.width);
  }
}

class SpringMobileMobile extends AbstractForce {
  constructor(mobileA, mobileB, length, tension = 1) {
    super();
    this.forceAtoB = new Spring(mobileB, mobileA, length, tension);
    this.forceBtoA = new Spring(mobileA, mobileB, length, tension);
  }

  apply() {
    this.forceAtoB.apply();
    this.forceBtoA.apply();
  }

  drawVector() {
    this.forceAtoB.drawVector();
    this.forceBtoA.drawVector();
  }

  drawSymbol() {
    this.forceAtoB.drawSymbol();
  }
}

class RigidLink extends SpringMobileMobile {
  constructor(mobileA, mobileB) {
    var length = mobileA.pos.sub(mobileB.pos).length();
    super(mobileA, mobileB, length, 1000);
  }
}


// ---- Mobiles ----

class Ball extends CircleUiComponent {
  // pos : Vector
  constructor(pos = new Vector(), spd = new Vector()) {
    super(pos, 10);
    // physic
    this.pos = this.shape.pos;
    this.spd = spd;
    this.mass = 1;
    this.electricCharge = 1;
    this.fAccumulator = new Vector(0, 0);
    this.canvasBouded = true;
    // interaction
    this.dragMouse = null;
    this.dragTension = 100;
    // style
    this.visible = true;
    this.fill.setAll(color(220));
    this.fill.set(UiComState.Hovered, color(150));
    this.fill.set(UiComState.Pressed, color(150));
    this.fill.set(UiComState.PressedMissed, color(150));
    this.stroke.setAll(color(100));
    this.strokeWeight.setAll(2);
    this.pastStroke = color(100, 100, 150);
    this.pastStrokeWeight = 1;
    this.pastMaxLength = 10;
    this.pastDots = [];
  }

  // f : Vector
  applyForce(f) {
    this.fAccumulator.addInplace(f);
  }

  // timeInS : number
  animate(timeInS) {
    if (this.dragMouse != null) {
      var deltaPos = this.dragMouse.sub(this.pos);
      var dragForce = deltaPos.normalize().scale(deltaPos.length() * this.dragTension);
      this.applyForce(dragForce);
    }

    var acc = this.fAccumulator.scale(1/this.mass);
    this.fAccumulator.set(0, 0);

    if (this.startDragPos != null) {
      this.pos.copy(this.startDragPos.add(this.dragMouse.sub(this.startDragMouse)));
    }

    this.spd.addInplace(acc.scale(timeInS));
    this.pos.addInplace(this.spd.scale(timeInS));

    if (this.canvasBouded) {
      if (this.pos.x - this.shape.rad < 0) {
        this.pos.x = this.shape.rad;
        this.spd.x = 0;
      }
      if (this.pos.x + this.shape.rad > width) {
        this.pos.x = width - this.shape.rad;
        this.spd.x = 0;
      }
      if (this.pos.y - this.shape.rad < 0) {
        this.pos.y = this.shape.rad;
        this.spd.y = 0;
      }
      if (this.pos.y + this.shape.rad > height) {
        this.pos.y = height - this.shape.rad;
        this.spd.y = 0;
      }
    }

    this.pastDots.push(this.pos.clone());
    while (this.pastDots.length > this.pastMaxLength) {
      this.pastDots.shift();
    }
  }

  startDrag(mouse) {
    this.dragMouse = mouse.clone();
  }
  dragEvent(mouse, lastMouse) {
    this.dragMouse = mouse.clone();
  }
  endDrag(mouse) {
    this.dragMouse = null;
  }

  drawComponent() {
    if (this.visible) {
      for (var i = 1; i < this.pastDots.length; i++) {
        var a = this.pastDots[i-1];
        var b = this.pastDots[i];
        strokeWeight(this.pastStrokeWeight);
        stroke(this.pastStroke);
        line(a.x, a.y, b.x, b.y);
      }
      super.drawComponent();
    }
  }
}

// ---- Tools ----

// a, b : Vector
// n, w : number
function drawZwigs(a, b, n, w) {
  function drawMoutain(a, b, h) {
    //        d         -|
    //    /   |   \      | h
    //  a --- c --- b   -|
    var ac = b.sub(a).scaleInplace(1/2);
    var cd = ac.rotate(PI/2).normalizeInplace().scale(h);
    var ad = ac.add(cd);
    var d = ad.add(a);
    // ad
    line(a.x, a.y, d.x, d.y);
    // db
    line(d.x, d.y, b.x, b.y);
  }

  var startPoint = a;
  var ruleSegment = b.sub(a).scaleInplace(1 / n);
  for (var i = 0; i < n; i++) {
    var endPoint = startPoint.add(ruleSegment);
    if (i % 2 == 0) {
      drawMoutain(startPoint, endPoint, w / 2);
    } else {
      drawMoutain(endPoint, startPoint, w / 2);
    }
    startPoint = endPoint;
  }
}

// a, b : Vector
// l : number
function drawArrow(a, b, l) {
  var norm = b.sub(a).normalize();
  line(a.x, a.y, b.x, b.y);
  var arrowSegEnd1 = norm.scale(l).rotateInplace(3 * PI/4).add(b);
  var arrowSegEnd2 = norm.scale(l).rotateInplace(-3 * PI/4).add(b);
  line(b.x, b.y, arrowSegEnd1.x, arrowSegEnd1.y);
  line(b.x, b.y, arrowSegEnd2.x, arrowSegEnd2.y);
}


function collisionSolver(ma, mb, via, vib) {
  var alpha = mb / ma;
  var vfa = ((1 - alpha) * via + 2 * alpha * vib ) / (alpha + 1);
  var vfb = (2 * via + (alpha - 1) * vib) / (alpha + 1);
  // test
  var iim = ma * via + mb * vib;
  var fim = ma * vfa + mb * vfb;
  var ien = ma * via * via / 2 + mb * vib * vib / 2;
  var fen = ma * vfa * vfa / 2 + mb * vfb * vfb / 2;
  console.assert(abs(iim - fim) < 0.0000001, "impulse not conserved", iim, fim);
  console.assert(abs(ien == fen) < 0.0000001, "energie not conserved", ien, fen);
  // test
  return [vfa, vfb];
}
