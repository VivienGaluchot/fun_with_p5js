
/* Atomic elements               */
/* Should not be manipuled alone */

class Box {
  constructor(name, ins, out, compute) {
    var current_box = this;
    this.name = name;
    this.ins = [];
    ins.forEach(function(v) {
      v.box = current_box;
      current_box.ins.push(v);
    });
    out.box = this;
    this.out = out;
    this.compute = compute;
  }

  // to override
  value() {
    return this.compute(this.ins);
  }

  is_valid(log = false) {
    var current_box = this;
    // check that all ins have this as box
    var ins_valid = this.ins.every(function(v) {
      if (log && v.box != current_box)
        console.error("wrong Box value for In", v, "in Box", current_box);
      return v.box == current_box;
    });
    // check that out have this as box
    var out_valid = (this.out.box == this);
    return ins_valid && out_valid;
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
      var current_in = this;
      this.out.ins = this.out.ins.filter(function(v) {
          return v !== current_in
      })
    }
    this.out = out;
    this.out.ins.push(this);
  }

  is_valid(log = false) {
    // check that out have the right type
    var out_valid = (this.out == null) || (this.out.type == this.type);
    if (log && !out_valid)
      console.error("wrong type for Out", this.out, "in In", this);
    return out_valid;
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

  is_valid(log = false) {
    var current_out = this;
    // check that all ins have this as out
    var ins_valid = this.ins.every(function(v) {
      if (log && v.out != current_out)
        console.error("wrong Out for In", v, "in Out", current_out);
      return v.out == current_out;
    });
    return ins_valid;
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

  register_box(box) {
    var current_assembler = this;
    this.boxs.push(box);
    box.ins.forEach(function(v) {
      current_assembler.ins.push(v);
    });
    current_assembler.outs.push(box.out);
  }

  is_valid(log = false) {
    function is_valid(v) {
      return v.is_valid(log);
    }
    var boxs_valid = this.boxs.every(is_valid);
    var ins_valid = this.ins.every(is_valid);
    var outs_valid = this.outs.every(is_valid);
    return boxs_valid && ins_valid && outs_valid;
  }
}
