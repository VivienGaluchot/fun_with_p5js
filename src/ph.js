class PhysicEnvironment {
  constructor() {
    this.mobiles = [];
    this.forces = [];
    this.last_draw_ms = 0;
  }

  draw() {
    // apply forces
    this.forces.forEach(function(force) {
      if (force.enabled) {
        force.apply();
      }
    });

    // animate mobiles
    var current_ms = millis();
    var d_ms = current_ms - this.last_draw_ms;
    this.last_draw_ms = current_ms;
    var d_s = d_ms / 1000;
    if (d_s > 0.1) {
      print("warning : time lost");
      d_s = 0.1;
    }
    this.mobiles.forEach(function(mobile) {
      mobile.animate(d_s);
    });

    // draw forces
    this.forces.forEach(function(force) {
      if (force.enabled && force.visible) {
        force.draw();
      }
    });

    // draw mobiles
    this.mobiles.forEach(function(mobile) {
      if (mobile.visible) {
        mobile.draw();
      }
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
    this.stroke = color(75);
    this.strokeWeight = 1;
  }
}

// A local force apply on a single mobile
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

  draw() {
    strokeWeight(this.strokeWeight);
    stroke(this.stroke);
    var f = this.getForce();
    var f_end = f.add(this.mobile.pos);
    line(this.mobile.pos.x, this.mobile.pos.y, f_end.x, f_end.y);
    var arrow_l = 5;
    var arrow_seg_end1 = f.normalize().scale_inplace(arrow_l).rotate_inplace(3 * PI/4).add(f_end);
    var arrow_seg_end2 = f.normalize().scale_inplace(arrow_l).rotate_inplace(-3 * PI/4).add(f_end);
    line(f_end.x, f_end.y, arrow_seg_end1.x, arrow_seg_end1.y);
    line(f_end.x, f_end.y, arrow_seg_end2.x, arrow_seg_end2.y);
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
    this.stroke = color(200, 100, 150);
  }

  // return : Vector
  getForce() {
    var delta_pos = this.attachment.pos.sub(this.mobile.pos);
    var delta_length = delta_pos.length() - this.length;
    return delta_pos.normalize().scale(delta_length * this.tension);
  }

  // draw() {
  //   strokeWeight(this.strokeWeight);
  //   stroke(this.stroke);
  //   line(this.attachment.pos.x, this.attachment.pos.y, this.mobile.pos.x, this.mobile.pos.y);
  // }
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

  draw() {
    this.forceAtoB.draw();
    this.forceBtoA.draw();
  }
}

class RigidLink extends SpringMobileMobile {
  constructor(mobileA, mobileB) {
    var length = mobileA.pos.sub(mobileB.pos).length();
    super(mobileA, mobileB, length, 1000);
  }
}


// ---- Mobiles ----

class Ball {
  // pos : Vector
  constructor(pos = new Vector(), spd = new Vector()) {
    // physic
    this.pos = pos;
    this.spd = spd;
    this.mass = 1;
    this.radius = 10;
    this.f_accumulator = new Vector(0, 0);
    // style
    this.visible = true;
    this.fill = color(220);
    this.stroke = color(100);
    this.strokeWeight = 2;
    this.past_stroke = color(100, 100, 150);
    this.past_strokeWeight = 1;
    this.past_max_length = 100;
    this.past_dots = [];
  }

  // f : Vector
  applyForce(f) {
    this.f_accumulator.add_inplace(f);
  }

  // s_time : number
  animate(s_time) {
    var acc = this.f_accumulator.scale(1/this.mass);
    this.f_accumulator.set(0, 0);

    this.spd.add_inplace(acc.scale(s_time));
    this.pos.add_inplace(this.spd.scale(s_time));

    this.past_dots.push(this.pos.clone());
    while (this.past_dots.length > this.past_max_length) {
      this.past_dots.shift();
    }
  }

  draw() {
    for (var i = 1; i < this.past_dots.length; i++) {
      var a = this.past_dots[i-1];
      var b = this.past_dots[i];
      strokeWeight(this.past_strokeWeight);
      stroke(this.past_stroke);
      line(a.x, a.y, b.x, b.y);
    }

    strokeWeight(this.strokeWeight);
    fill(this.fill);
    stroke(this.stroke);
    ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
  }
}
