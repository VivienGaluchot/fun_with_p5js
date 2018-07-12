class Vector {
  constructor(x = 0, y = 0){
    this.set(x, y);
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  // v : Vector
  copy(v) {
    this.x = v.x;
    this.y = v.y;
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
    if (this.length() > 0)
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

class AbstractShape {
  constructor() {}
  // a : Vector
  contains(a) { return false; }
  draw() {}
}

class Rectangle {
  // pos, dim : Vector
  constructor(pos, dim) {
    this.pos = pos;
    this.dim = dim;
  }
  // a : Vector
  // return : bool
  contains(a) {
    return (a.x >= this.pos.x) && (a.x <= this.pos.x + this.dim.x) &&
      (a.y >= this.pos.y) && (a.y <= this.pos.y + this.dim.y);
  }
  draw() {
    rect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
  }
}

class Circle {
  // pos : Vector
  // rad : number
  constructor(pos, rad) {
    this.pos = pos;
    this.rad = rad;
  }
  // a : Vector
  // return : bool
  contains(a) {
    var d = a.sub(this.pos);
    return d.length() <= this.rad;
  }
  draw() {
    ellipse(this.pos.x, this.pos.y, this.rad * 2, this.rad * 2);
  }
}

class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.values = [];
    for (var row = 0; row < this.rows; row++) {
      this.values[row] = [];
      for (var col = 0; col < this.cols; col++) {
        this.values[row][col] = 0;
      }
    }
  }

  // f : function(currentValue, row, col), return : number to update
  forEach(f) {
  for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        this.values[row][col] = f(this.values[row][col], row, col);
      }
    }
  }

  // row : number
  // col : number
  // value : number
  setValue(value, row, col) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      this.values[row][col] = value;
    }
  }

  // row : number
  // col : number
  // return : number or undefined
  getValue(row, col) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      return this.values[row][col];
    } else {
      return undefined;
    }
  }

  print() {
    this.values.forEach(function(row) {
      var str = "";
      row.forEach(function(v) {
        str += v + " ";
      });
      print(str);
    });
  }

  // other : Matrix
  // return : Matrix (this * other)
  product(other) {
    if (this.cols == other.rows) {
      var result = new Matrix(this.rows, other.cols);
      for (var row = 0; row < result.rows; row++) {
        for (var col = 0; col < result.cols; col++) {
          var value = 0;
          for (var i = 0; i < this.cols; i++) {
            value += this.values[row][i] * other.values[i][col];
          }
          result.values[row][col] = value;
        }
      }
      return result;
    } else {
      return undefined;
    }
  }
}

// TODO
class LinearTransformation {
  constructor() {
    this.matrix = new Matrix(2, 2);
    this.matrix.forEach(function(v, r, c) {
      return (r == c) ? 1 : 0;
    });
  }

  // m : Matrix
  push(m) {
    if (m.rows == this.matrix.rows && m.cols == this.matrix.cols) {
      this.matrix = this.matix.product(m);
    }
  }

  // n : number
  scale(n) {
    var matrix = new Matrix(2, 2);
    matrix.forEach(function(v, r, c) {
      return (r == c) ? n : 0;
    });
    this.push(matrix);
  }

  // a : angle in randiant
  rotate(a) {
    var matrix = new Matrix(2, 2);
    matrix.setValue(0, 0, cos(a));
    matrix.setValue(0, 1, -sin(a));
    matrix.setValue(1, 0, sin(a));
    matrix.setValue(1, 1, cos(a));
    this.push(matrix);
  }

  // v : Vector
  translate(v) {

  }

  // v : Vector
  // return : Vector
  appliTransformation(v) {

  }

  // v : Vector
  // return : Vector
  appliTransformationInverse(v) {

  }
}
