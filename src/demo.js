class Demo {
  constructor() {
    this.env = new PhysicEnvironment();

    var ball_space = 50;

    // ball1
    var ball1 = new Ball(new Vector(width / 4, height / 2));
    ball1.mass = 0.5;
    ball1.past_stroke = color(100, 100, 150);
    this.env.mobiles.push(ball1);

    var gravity = new LocalGravity(ball1, new Vector(0, 100));
    this.env.forces.push(gravity);

    var friction = new LocalFriction(ball1, 0.1);
    this.env.forces.push(friction);

    this.env.forces.push(new Spring(ball1, new Localised(new Vector( width / 6, height / 2)), 80, 10));
    this.env.forces.push(new Spring(ball1, new Localised(new Vector( 2 * width / 6, height / 2)), 80, 10));

    this.mouseForce = new Spring(ball1, new Localised(), 50, 5);
    this.mouseForce.enabled = false;
    this.mouseForce.strokeWeight = 1;
    this.env.forces.push(this.mouseForce);

    // ball2
    var ball2 = new Ball(new Vector(width / 4, height / 2 + ball_space));
    ball2.mass = 0.3;
    ball2.past_stroke = color(100, 150, 100);
    this.env.mobiles.push(ball2);

    var gravity2 = new LocalGravity(ball2, new Vector(0, 100));
    this.env.forces.push(gravity2);

    var friction2 = new LocalFriction(ball2, 0.1);
    this.env.forces.push(friction2);

    var smm12 = new SpringMobileMobile(ball1, ball2, ball_space, 10);
    this.env.forces.push(smm12);

    // TODO fix rigid links
    /*  var rl = new RigidLink(ball1, ball2);
      this.env.forces.push(rl);*/

    // ball3
    var ball3 = new Ball(new Vector(width / 4, height / 2 + 2 * ball_space));
    ball3.mass = 0.2;
    ball3.past_stroke = color(150, 100, 100);
    this.env.mobiles.push(ball3);

    var gravity3 = new LocalGravity(ball3, new Vector(0, 100));
    this.env.forces.push(gravity3);

    var friction3 = new LocalFriction(ball3, 0.1);
    this.env.forces.push(friction3);

    var smm23 = new SpringMobileMobile(ball2, ball3, ball_space, 5);
    this.env.forces.push(smm23);


    // right
    var drawGrid = {x: 5*width/8,
      y: height/4,
      w: width/4,
      h: height/2,
      r: 3,
      c: 5};
    var generatedBalls = [];
    for (var i = 0; i < drawGrid.r; i++) {
      for (var j = 0; j < drawGrid.c; j++) {
        var x = drawGrid.x + drawGrid.w / (drawGrid.r - 1) * i;
        var y = drawGrid.y + drawGrid.h / (drawGrid.c - 1) * j;
        var ball = new Ball(new Vector(x, y));
        ball.past_max_length = 10;

        this.env.forces.push(new LocalFriction(ball, 10));
        var global_env = this.env;
        generatedBalls.forEach(function(el) {
          if (random(100) > 85) {
            var link = new SpringMobileMobile(ball, el, 50, 100);
            link.drawSymbol = function() {
              strokeWeight(1);
              stroke(color(200));
              line(this.forceAtoB.mobile.pos.x, this.forceAtoB.mobile.pos.y,
                this.forceBtoA.mobile.pos.x, this.forceBtoA.mobile.pos.y);
            }
            global_env.forces.push(link);
          } else if (random(100) < 85) {
            var link = new SpringMobileMobile(ball, el, 200, 5);
            link.drawSymbol = function() {
            }
            global_env.forces.push(link);
          }
        });
        generatedBalls.push(ball);

        this.env.mobiles.push(ball);
      }
    }
  }

  draw(mouse, draw_forces = true) {
    // left
    if (mouseIsPressed) {
      this.mouseForce.attachment.pos = mouse;
      this.mouseForce.enabled = true;
    } else {
      this.mouseForce.enabled = false;
    }
    this.env.draw_forces = draw_forces;
    this.env.draw(mouse);

    strokeWeight(1);
    stroke(color(50));
    line(width / 2, height / 9, width / 2, 8 * height / 9);

    // right

  }
}
