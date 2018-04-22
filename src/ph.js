var PhysicEnvironment = class {
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

var Gravity = class {
  // mobile : object with attribute mass : number
  // vector : Vector
  constructor(mobile, vector = new Vector()) {
    // physic
    this.enabled = true;
    this.mobile = mobile;
    this.vector = vector;
    // style
    this.visible = true;
    this.stroke = color(100, 150, 100);
    this.strokeWeight = 1;
  }

  getForce() {
    return this.vector.scale(this.mobile.mass);
  }

  apply() {
    this.mobile.applyForce(this.getForce());
  }

  draw() {
    // strokeWeight(this.strokeWeight);
    // stroke(this.stroke);
    // var f_end = this.getForce().add(this.mobile.pos);
    // line(this.mobile.pos.x, this.mobile.pos.y, f_end.x, f_end.y);
  }
}

var Friction = class {
  // mobile : object with attribute mass : number
  // intensity : number
  constructor(mobile, intensity) {
    // physic
    this.enabled = true;
    this.mobile = mobile;
    this.intensity = intensity;
    // style
    this.visible = true;
    this.stroke = color(100, 150, 100);
    this.strokeWeight = 1;
  }

  getForce() {
    return this.mobile.spd.scale(-1 * this.intensity);
  }

  apply() {
    this.mobile.applyForce(this.getForce());
  }

  draw() {
    // strokeWeight(this.strokeWeight);
    // stroke(this.stroke);
    // var f_end = this.getForce().add(this.mobile.pos);
    // line(this.mobile.pos.x, this.mobile.pos.y, f_end.x, f_end.y);
  }
}

var Spring = class {
  // mobile : object with attribute pos : Vector
  // attachement : Vector
  // tension : number
  constructor(mobile, attachment = new Vector(), length, tension = 1) {
    // physic
    this.enabled = true;
    this.attachment = attachment;
    this.mobile = mobile;
    this.length = length;
    this.tension = tension;
    // style
    this.visible = true;
    this.stroke = color(150, 100, 100);
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


// ---- Mobiles ----

var Ball = class {
  // pos : Vector
  constructor(pos = new Vector(), spd = new Vector()) {
    // physic
    this.pos = pos;
    this.spd = spd;
    this.mass = 0.5;
    this.f_accumulator = new Vector(0, 0);
    // style
    this.visible = true;
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
      strokeWeight(1);
      stroke(100, 100, 150);
      line(a.x, a.y, b.x, b.y);
    }

    strokeWeight(2);
    fill(220);
    stroke(150, 100, 100);
    ellipse(this.pos.x, this.pos.y, 20, 20);
  }
}
