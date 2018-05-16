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
    // interaction
    this.hovered = false;
    this.clicked = false;
    this.selected = false;
    this.dragged = false;
    this.clickStartPosition = null;
  }

  // TODO call on event
  clickEvent() {}
  hoverEvent() {}
  selectEvent() {}
  drawEvent() {}

  drawComponent() {
    fill(this.fill);
    stroke(this.stroke);
    strokeWeight(this.strokeWeight);
    textSize(this.textSize);
    if (this.hovered)
      stroke(color(250, 0, 0));
    this.shape.draw();
  }

  draw() {
    var mouse = new Vector(mouseX, mouseY);
    this.hovered = this.contains(mouse);

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
  }

  drawComponent() {
    super.drawComponent();
    strokeWeight(0);
    fill(this.stroke);
    text("Hello world !", this.shape.pos.x + 5, this.shape.pos.y + 5, this.shape.dim.x - 10, this.shape.dim.y - 10);
  }
}
