class Vector {
  constructor(x = 0, y = 0){
    this.set(x, y);
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  // x : number
  // y : number
  set(x = 0, y = 0)  {
    this.x = x;
    this.y = y;
  }

  // return : number
  length() {
    return sqrt(this.x * this.x + this.y * this.y);
  }


  // Vector transformations

  // return : Vector
  normalize_inplace() {
    this.scale_inplace(1 / this.length());
    return this;
  }

  // return : Vector
  normalize() {
    return this.clone().normalize_inplace();
  }

  // v : Vector
  // return Vector
  add_inplace(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  // v : Vector
  // return Vector
  add(v) {
    return this.clone().add_inplace(v);
  }

  // v : Vector
  // return Vector
  sub_inplace(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  // v : Vector
  // return Vector
  sub(v) {
    return this.clone().sub_inplace(v);
  }

  // a : number, angle in radiant
  // return Vector
  rotate_inplace(a) {
    var c = cos(a);
    var s = sin(a);
    var px = this.x;
    var py = this.y;
    this.x = c * px - s * py;
    this.y = s * px + c * py;
    return this;
  }

  // a : number, angle in radiant
  // return Vector
  rotate(a) {
    return this.clone().rotate_inplace(a);
  }

  // a : number
  // return Vector
  scale_inplace(a) {
    this.x = this.x * a;
    this.y = this.y * a;
    return this;
  }

  // a : number
  scale(a) {
    return this.clone().scale_inplace(a);
  }
}

class Localised {
  constructor(pos = new Vector()) {
    this.pos = pos;
  }
}
