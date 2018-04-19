var Vector = class {
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

  // return : Vector
  normalized() {
    return this.scale(1 / this.length());
  }

  // v : Vector
  // return Vector
  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  // v : Vector
  add_inplace(v) {
    this.x += v.x;
    this.y += v.y;
  }

  // v : Vector
  // return Vector
  sub(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  // v : Vector
  sub_inplace(v) {
    this.x -= v.x;
    this.y -= v.y;
  }

  // a : number
  scale(a) {
    return new Vector(this.x * a, this.y * a);
  }
}
