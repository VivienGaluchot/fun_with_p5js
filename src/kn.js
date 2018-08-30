/* Atomic elements               */
/* Should not be manipuled alone */

class Box {
  constructor(name, ins, out, compute) {
    var currentBox = this;
    this.name = name;
    this.ins = [];
    ins.forEach(function(v) {
      v.box = currentBox;
      currentBox.ins.push(v);
    });
    out.box = this;
    this.out = out;
    this.compute = compute;
  }

  // to override
  value() {
    return this.compute(this.ins);
  }

  isValid(log = false) {
    var currentBox = this;
    // check that all ins have this as box
    var insValid = this.ins.every(function(v) {
      if (log && v.box != currentBox)
        console.error("wrong Box value for In", v, "in Box", currentBox);
      return v.box == currentBox;
    });
    // check that out have this as box
    var outValid = (this.out.box == this);
    return insValid && outValid;
  }
}

class In {
  constructor(name, type) {
    this.name = name;
    this.box = null;
    this.out = null;
    this.type = type;
  }

  value() {
    return this.out.value();
  }

  connect(out) {
    if (this.out != null) {
      var currentIn = this;
      this.out.ins = this.out.ins.filter(function(v) {
        return v !== currentIn
      })
    }
    this.out = out;
    this.out.ins.push(this);
  }

  isValid(log = false) {
    // check that out have the right type
    var outValid = (this.out == null) || (this.out.type == this.type);
    if (log && !outValid)
      console.error("wrong type for Out", this.out, "in In", this);
    return outValid;
  }
}

class Out {
  constructor(name, type) {
    this.name = name;
    this.box = null;
    this.ins = [];
    this.type = type;
  }

  value() {
    return this.box.value();
  }

  isValid(log = false) {
    var currentOut = this;
    // check that all ins have this as out
    var insValid = this.ins.every(function(v) {
      if (log && v.out != currentOut)
        console.error("wrong Out for In", v, "in Out", currentOut);
      return v.out == currentOut;
    });
    return insValid;
  }
}


/* Macro element          */
/* Handles set of atomics */

class Assembler {
  constructor() {
    this.boxs = [];
    this.ins = [];
    this.outs = [];
  }

  registerBox(box) {
    var currentAssembler = this;
    this.boxs.push(box);
    box.ins.forEach(function(v) {
      currentAssembler.ins.push(v);
    });
    currentAssembler.outs.push(box.out);
  }

  isValid(log = false) {
    function isValid(v) {
      return v.isValid(log);
    }
    var boxsValid = this.boxs.every(isValid);
    var insValid = this.ins.every(isValid);
    var outsValid = this.outs.every(isValid);
    return boxsValid && insValid && outsValid;
  }
}
