/* Usable types */

var baseTypes = Object.freeze({
  bool: {
    value: 0,
    name: "bool"
  },
  number: {
    value: 1,
    name: "number"
  },
  string: {
    value: 2,
    name: "string"
  },
})


/* Box implementations */

class CBox extends Box {
  constructor(type, value) {
    super("constant",
      // ins
      [],
      // out
      new Out("constant", type),
      // compute
      function() {
        return value;
      }
    );
  }
}

class AddBox extends Box {
  constructor() {
    super("add",
      // ins
      [new In("a", baseTypes.number), new In("b", baseTypes.number)],
      // out
      new Out("a+b", baseTypes.number),
      // compute
      function(ins) {
        return ins[0].value() + ins[1].value();
      }
    );
  }
}

/* Run tests */
console.log("Assembler testing");

console.assert(false, "assert error test, expected to fail");

var as = new Assembler;

var cBox4 = new CBox(baseTypes.number, 4);
console.assert(cBox4.isValid(true), "simple box invalid", cBox4);
as.registerBox(cBox4);

var cBox7 = new CBox(baseTypes.number, 7);
console.assert(cBox7.isValid(true), "simple box invalid", cBox7);
as.registerBox(cBox7);
console.assert(as.isValid(true), "Assembler invalid", as);

console.assert(cBox4.out.value() != 5, "unexpected value", cBox4.out.value(), cBox4);
console.assert(cBox4.out.value() == 4, "unexpected value", cBox4.out.value(), cBox4);
console.assert(cBox7.out.value() == 7, "unexpected value", cBox7.out.value(), cBox7);

var addBox = new AddBox();
as.registerBox(addBox);
console.assert(addBox.isValid(true), "simple box invalid", addBox);
console.assert(as.isValid(true), "Assembler invalid", as);

addBox.ins[0].connect(cBox4.out);
addBox.ins[1].connect(cBox7.out);
console.assert(as.isValid(true), "Assembler invalid", as);

console.assert(addBox.out.value() == (4 + 7), "unexpected value", addBox.out.value(), addBox);

console.log("Done");
