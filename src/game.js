var Ball = class {
  // pos : Vector
  constructor(pos = new Vector(), spd = new Vector()) {
    this.pos = pos;
    this.spd = spd;

    this.mass = 5;

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
    var acc = this.f_accumulator.scale(this.mass);
    this.f_accumulator.set(0, 0);

    this.spd.add_inplace(acc.scale(s_time));
    this.pos.add_inplace(this.spd.scale(s_time));

    this.past_dots.push(this.pos.clone());
    while (this.past_dots.length > this.past_max_length) {
      this.past_dots.shift();
    }
  }

  draw() {
    var i = this.past_max_length;
    var past_max_length = this.past_max_length;
    this.past_dots.forEach(function(el) {
      strokeWeight(0);
      fill(100);
      var size = ((past_max_length - i) / past_max_length) * 10;
      ellipse(el.x, el.y, size, size);
      i--;
    });

    strokeWeight(2);
    fill(220);
    stroke(150, 100, 100);
    ellipse(this.pos.x, this.pos.y, 20, 20);
  }
}
