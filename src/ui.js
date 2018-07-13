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
    this.isDragged = false;
    // flags
    this.clickEventFlag = false;
    this.startDragEventFlag = false;
    this.dragEventFlag = false;
    this.endDragEventFlag = false;
  }

  update(entered, exited, clicked, release, moved) {
    this.clickEventFlag = false;
    this.startDragEventFlag = false;
    this.dragEventFlag = false;
    this.endDragEventFlag = false;

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
        this.startDragEventFlag = !this.isDragged;
        this.dragEventFlag = true;
        this.isDragged = true;
      }
      if (exited) {
        this.state = UiComState.PressedMissed;
      } else if (release) {
        this.endDragEventFlag = this.isDragged;
        this.isDragged = false;
        this.clickEventFlag = true;
        this.state = UiComState.Hovered;
      }
    } else if (this.state == UiComState.PressedMissed) {
      if (moved && !release) {
        this.startDragEventFlag = !this.isDragged;
        this.dragEventFlag = true;
        this.isDragged = true;
      }
      if (entered) {
        this.state = UiComState.Pressed;
      } else if (release) {
        this.endDragEventFlag = this.isDragged;
        this.isDragged = false;
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
    this.children = [];
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

  getState() {
    return this.stateMachine.state;
  }
  isDragged() {
    return this.stateMachine.isDragged;
  }

  // a : Vector
  // return : bool
  contains(a) {
    if (this.shape == null)
      return false;
    else
      return this.shape.contains(a);
    // Recursive version
    // if (this.shape.contains(a))
    //   return true;
    // for (var i = 0; i < this.children.length; i++) {
    //  if (this.children[i].contains(a))
    //    return true;
    // }
    // return false;
  }

  // user events
  clickEvent(mouse) {}
  startDrag(mouse) {}
  dragEvent(mouse, lastMouse) {}
  endDrag(mouse) {}
  drawComponent() {
    if (this.shape == null)
      return;
    fill(this.fill);
    stroke(this.stroke);
    strokeWeight(this.strokeWeight);
    textSize(this.textSize);
    this.shape.draw();
  }

  update(mouse, pressed) {
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

    this.children.forEach(function(child) {
      child.update(mouse, pressed);
    });

    if (this.stateMachine.clickEventFlag)
      this.clickEvent(mouse);
    if (this.stateMachine.startDragEventFlag)
      this.startDrag(mouse);
    if (this.stateMachine.dragEventFlag)
      this.dragEvent(mouse, this.lastInputs.mouse);
    if (this.stateMachine.endDragEventFlag)
      this.endDrag(mouse);
    this.lastInputs = {mouse: mouse, pressed: pressed, contains: contains};
  }

  draw() {
    this.drawComponent();
    this.children.forEach(function(child) {
      child.draw();
    });
  }
}

class OmniUiComponent extends AbstractUiComponent {
  constructor() {
    super(null);
  }
  contains(a) { return true }
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
    if (this.getState() == UiComState.Hovered)
      fill(color(0, 100, 0));
    if (this.getState() == UiComState.Pressed)
      fill(color(100, 0, 0));
    if (this.getState() == UiComState.PressedMissed)
      fill(color(0, 0, 100));
    if (this.isDragged())
      fill(color(200, 0, 0));
    text(this.text, this.shape.pos.x + 5, this.shape.pos.y + 5, this.shape.dim.x - 10, this.shape.dim.y - 10);
  }
}

class CircleUiComponent extends AbstractUiComponent {
  // pos : Vector
  // rad : number
  constructor(pos, rad) {
    super(new Circle(pos, rad));
  }
}

class DummyCircleUiComponent extends CircleUiComponent {
  // pos : Vector
  // rad : number
  constructor(pos, rad) {
    super(pos, rad);
    this.text = "Hello world ! I'm a circle";
    this.counter = 0;
    this.locked = false;
  }

  clickEvent(mouse) {
    this.counter = this.counter + 1;
    this.text = "click " + this.counter + ", inside a circle";
  }

  dragEvent(mouse, lastMouse) {
    if (!this.locked)
      this.shape.pos.add_inplace(mouse.sub(lastMouse));
  }

  drawComponent() {
    super.drawComponent();
    strokeWeight(0);
    fill(this.stroke);
    if (this.getState() == UiComState.Hovered)
      fill(color(0, 100, 0));
    if (this.getState() == UiComState.Pressed)
      fill(color(100, 0, 0));
    if (this.getState() == UiComState.PressedMissed)
      fill(color(0, 0, 100));
    if (this.isDragged())
      fill(color(200, 0, 0));
    var x = sqrt(2) * this.shape.rad;
    text(this.text, this.shape.pos.x - x / 2, this.shape.pos.y - x / 2, x, x);
  }
}
