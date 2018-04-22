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

class Force {
  constructor() {
    // physic
    this.enabled = true;
    // style
    this.visible = true;
    this.stroke = color(75);
    this.strokeWeight = 1;
  }

  getForce() {
    // to implement
  }

  apply() {
    // to implement
  }

  draw() {
    // to implement
  }
}

class Gravity extends Force {
  // mobile : object with attribute mass : number
  // vector : Vector
  constructor(mobile, vector = new Vector()) {
    super();
    // physic
    this.mobile = mobile;
    this.vector = vector;
  }

  getForce() {
    return this.vector.scale(this.mobile.mass);
  }

  apply() {
    this.mobile.applyForce(this.getForce());
  }

  draw() {
    strokeWeight(this.strokeWeight);
    stroke(this.stroke);
    var f_end = this.getForce().add(this.mobile.pos);
    line(this.mobile.pos.x, this.mobile.pos.y, f_end.x, f_end.y);
  }
}

class Friction extends Force {
  // mobile : object with attribute mass : number
  // intensity : number
  constructor(mobile, intensity) {
    super();
    // physic
    this.mobile = mobile;
    this.intensity = intensity;
  }

  getForce() {
    return this.mobile.spd.scale(-1 * this.intensity);
  }

  apply() {
    this.mobile.applyForce(this.getForce());
  }

  draw() {
    strokeWeight(this.strokeWeight);
    stroke(this.stroke);
    var f_end = this.getForce().add(this.mobile.pos);
    line(this.mobile.pos.x, this.mobile.pos.y, f_end.x, f_end.y);
  }
}

class Spring extends Force {
  // mobile : object with attribute pos : Vector
  // attachement : Vector
  // tension : number
  constructor(mobile, attachment = new Vector(), length, tension = 1) {
    super();
    // physic
    this.attachment = attachment;
    this.mobile = mobile;
    this.length = length;
    this.tension = tension;
    // style
    this.stroke = color(75);
    this.strokeWeight = 2;
  }

  // return : Vector
  getForce() {
    var delta_pos = this.attachment.sub(this.mobile.pos);
    var delta_length = delta_pos.length() - this.length;
    return delta_pos.normalized().scale(delta_length * this.tension);
  }

  apply() {
    this.mobile.applyForce(this.getForce());
  }

  draw() {
    strokeWeight(this.strokeWeight);
    stroke(this.stroke);
    line(this.attachment.x, this.attachment.y, this.mobile.pos.x, this.mobile.pos.y);
  }
}

class SpringMobileMobile extends Force {
  // mobileA : object with attribute pos : Vector
  // mobileB : object with attribute pos : Vector
  // tension : number
  constructor(mobileA, mobileB, length, tension = 1) {
    super();
    // physic
    this.mobileA = mobileA;
    this.mobileB = mobileB;
    this.length = length;
    this.tension = tension;
    // style
    this.stroke = color(75);
    this.strokeWeight = 2;
  }

  // return : Vector
  getForce() {
    var delta_pos = this.mobileB.pos.sub(this.mobileA.pos);
    var delta_length = delta_pos.length() - this.length;
    return delta_pos.normalized().scale(delta_length * this.tension);
  }

  apply() {
    var f = this.getForce();
    this.mobileA.applyForce(f);
    this.mobileB.applyForce(f.scale(-1));
  }

  draw() {
    strokeWeight(this.strokeWeight);
    stroke(this.stroke);
    line(this.mobileA.pos.x, this.mobileA.pos.y, this.mobileB.pos.x, this.mobileB.pos.y);
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
