class Demo {
  constructor() {
    this.env = new PhysicEnvironment();

    var ballSpace = 50;

    // ball1
    var ball1 = new Ball(new Vector(width / 4, height / 2));
    ball1.mass = 0.5;
    ball1.pastStroke = color(100, 100, 150);
    this.env.children.push(ball1);

    var gravity = new LocalGravity(ball1, new Vector(0, 100));
    this.env.forces.push(gravity);

    var friction = new LocalFriction(ball1, 0.1);
    this.env.forces.push(friction);

    this.env.forces.push(new Spring(ball1, new Localised(new Vector(width / 6, height / 2)), 80, 10));
    this.env.forces.push(new Spring(ball1, new Localised(new Vector(2 * width / 6, height / 2)), 80, 10));

    // ball2
    var ball2 = new Ball(new Vector(width / 4, height / 2 + ballSpace));
    ball2.mass = 0.3;
    ball2.pastStroke = color(100, 150, 100);
    this.env.children.push(ball2);

    var gravity2 = new LocalGravity(ball2, new Vector(0, 100));
    this.env.forces.push(gravity2);

    var friction2 = new LocalFriction(ball2, 0.1);
    this.env.forces.push(friction2);

    var smm12 = new SpringMobileMobile(ball1, ball2, ballSpace, 10);
    this.env.forces.push(smm12);

    // TODO fix rigid links
    /*  var rl = new RigidLink(ball1, ball2);
      this.env.forces.push(rl);*/

    // ball3
    var ball3 = new Ball(new Vector(width / 4, height / 2 + 2 * ballSpace));
    ball3.mass = 0.2;
    ball3.pastStroke = color(150, 100, 100);
    this.env.children.push(ball3);

    var gravity3 = new LocalGravity(ball3, new Vector(0, 100));
    this.env.forces.push(gravity3);

    var friction3 = new LocalFriction(ball3, 0.1);
    this.env.forces.push(friction3);

    var smm23 = new SpringMobileMobile(ball2, ball3, ballSpace, 5);
    this.env.forces.push(smm23);


    // right
    var drawGrid = {
      x: 5 * width / 8,
      y: height / 4,
      w: width / 4,
      h: height / 2,
      r: 3,
      c: 5
    };
    var generatedBalls = [];
    for (var i = 0; i < drawGrid.r; i++) {
      for (var j = 0; j < drawGrid.c; j++) {
        var x = drawGrid.x + drawGrid.w / (drawGrid.r - 1) * i;
        var y = drawGrid.y + drawGrid.h / (drawGrid.c - 1) * j;
        var ball = new Ball(new Vector(x, y));
        ball.pastMaxLength = 10;

        this.env.forces.push(new LocalFriction(ball, 10));
        var globalEnv = this.env;
        generatedBalls.forEach(function(el) {
          if (random(100) > 85) {
            var link = new SpringMobileMobile(ball, el, 50, 100);
            link.drawSymbol = function() {
              strokeWeight(1);
              stroke(color(200));
              line(this.forceAtoB.mobile.pos.x, this.forceAtoB.mobile.pos.y,
                this.forceBtoA.mobile.pos.x, this.forceBtoA.mobile.pos.y);
            }
            globalEnv.forces.push(link);
          } else if (random(100) < 85) {
            var link = new SpringMobileMobile(ball, el, 200, 5);
            link.drawSymbol = function() {}
            globalEnv.forces.push(link);
          }
        });
        generatedBalls.push(ball);

        this.env.children.push(ball);
      }
    }
  }

  draw(mouse, drawForces = true) {
    this.env.forces.forEach(function(el) {
      el.vectorVisible = drawForces;
    });

    this.env.update(mouse, mouseIsPressed);
    this.env.draw();

    strokeWeight(1);
    stroke(color(50));
    line(width / 2, height / 9, width / 2, 8 * height / 9);
  }
}
