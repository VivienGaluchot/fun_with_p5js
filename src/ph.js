var Spring = class {
  // mobile : object with attribute pos : Vector
  // attachement : Vector
  // tension : number
  constructor(mobile, attachment = new Vector(), length, tension = 1) {
    this.attachment = attachment;
    this.mobile = mobile;
    this.length = length;
    this.tension = tension;
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
    strokeWeight(2);
    stroke(150, 100, 100);
    line(this.attachment.x, this.attachment.y, this.mobile.pos.x, this.mobile.pos.y);
  }
}

var Ball = class {
  // pos : Vector
  constructor(pos = new Vector(), spd = new Vector()) {
    this.pos = pos;
    this.spd = spd;

    this.mass = 0.5;

    this.f_accumulator = new Vector(0, 0);

    this.past_max_length = 100;
    this.past_dots = [];
  }

  // f : Vector
  applyForce(f) {
    this.f_accumulator.add_inplace(f);
  }

  // s_time : number
  animate(s_time) {
    if (s_time > 0.1) {
      print("warning : time overflow");
      s_time = 0.1;
    }
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
