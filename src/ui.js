UiComState = Object.freeze({
  Idle : 1,
  Hovered : 2,
  Pressed : 3,
  PressedMissed : 4
});

class StateMachine {
  constructor() {
    // current state
    this.state = UiComState.Idle;
    // flags
    this.dragEventFlag = false;
    this.clickEventFlag = false;
  }

  update(entered, exited, clicked, release, moved) {
    this.dragEventFlag = false;
    this.clickEventFlag = false;
    if (entered && exited || clicked && release) {
      // unexpected inputs
      this.state = UiComState.Idle;
      return;
    }

    if (this.state == UiComState.Idle) {
      if (entered) {
        this.state = UiComState.Hovered;
      }
    } else if (this.state == UiComState.Hovered) {
      if (exited) {
        this.state = UiComState.Idle;
      } else if (clicked) {
        this.state = UiComState.Pressed;
      }
    } else if (this.state == UiComState.Pressed) {
      if (moved && !release) {
        this.dragEventFlag = true;
      }
      if (exited) {
        this.state = UiComState.PressedMissed;
      } else if (release) {
        this.clickEventFlag = true;
        this.state = UiComState.Hovered;
      }
    } else if (this.state == UiComState.PressedMissed) {
      if (moved && !release) {
        this.dragEventFlag = true;
      }
      if (entered) {
        this.state = UiComState.Pressed;
      } else if (release) {
        this.state = UiComState.Idle;
      }
    }
  }
}

class AbstractUiComponent {
  // shape : AbstractShape
  constructor(shape) {
    // build
    this.shape = shape;
    this.childs = [];
    // style
    this.visible = true;
    this.fill = color(230);
    this.stroke = color(50);
    this.strokeWeight = 1;
    this.textSize = 15;
    // state
    this.lastInputs = null;
    this.stateMachine = new StateMachine();
  }

  // user events
  clickEvent(mouse) {}
  dragEvent(mouse, lastMouse) {}

  drawComponent() {
    fill(this.fill);
    stroke(this.stroke);
    strokeWeight(this.strokeWeight);
    textSize(this.textSize);
    if (this.stateMachine.state == UiComState.Hovered)
      stroke(color(0, 250, 0));
    if (this.stateMachine.state == UiComState.Pressed)
      stroke(color(250, 0, 0));
    if (this.stateMachine.state == UiComState.PressedMissed)
      stroke(color(0, 0, 250));
    this.shape.draw();
  }

  update() {
    // inputs
    var mouse = new Vector(mouseX, mouseY);
    var pressed = mouseIsPressed;
    // state transitions
    var entered, exited, clicked, release, moved = false;
    var contains = this.contains(mouse);
    var movement = null;
    if (this.lastInputs == null) {
      entered = contains;
      clicked = entered && pressed;
    } else {
      entered = contains && !this.lastInputs.contains;
      exited = !contains && this.lastInputs.contains;
      clicked = pressed && !this.lastInputs.pressed;
      release = !pressed && this.lastInputs.pressed;
      movement = mouse.sub(this.lastInputs.mouse);
      moved = movement.length() > 0;
    }
    this.stateMachine.update(entered, exited, clicked, release, moved);

    this.childs.forEach(function(child) {
      child.update();
    });

    if (this.stateMachine.clickEventFlag)
      this.clickEvent(mouse);
    if (this.stateMachine.dragEventFlag)
      this.dragEvent(mouse, this.lastInputs.mouse);
    this.lastInputs = {mouse: mouse, pressed: pressed, contains: contains};
  }

  draw() {
    this.drawComponent();
    this.childs.forEach(function(child) {
      child.draw();
    });
  }

  // a : Vector
  // return : bool
  contains(a) {
    if (this.shape.contains(a))
      return true;
    for (var i = 0; i < this.childs.length; i++) {
     if (this.childs[i].contains(a))
       return true;
    }
    return false;
  }
}

class RectangleUiComponent extends AbstractUiComponent {
  // pos, dim : Vector
  constructor(pos, dim) {
    super(new Rectangle(pos, dim));
  }
}

class DummyRectangleUiComponent extends RectangleUiComponent {
  // pos, dim : Vector
  constructor(pos, dim) {
    super(pos, dim);
    this.text = "Hello world !";
    this.counter = 0;
    this.locked = false;
  }

  clickEvent(mouse) {
    this.counter = this.counter + 1;
    this.text = "click " + this.counter;
  }

  dragEvent(mouse, lastMouse) {
    if (!this.locked)
      this.shape.pos.add_inplace(mouse.sub(lastMouse));
  }

  drawComponent() {
    super.drawComponent();
    strokeWeight(0);
    fill(this.stroke);
    text(this.text, this.shape.pos.x + 5, this.shape.pos.y + 5, this.shape.dim.x - 10, this.shape.dim.y - 10);
  }
}
