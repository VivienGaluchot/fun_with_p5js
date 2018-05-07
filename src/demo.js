class Demo {
  constructor() {
    this.env = new PhysicEnvironment();

    var ball_space = 50;

    // ball1

    var ball1 = new Ball(new Vector(width / 2, height / 2));
    ball1.mass = 0.5;
    ball1.past_stroke = color(100, 100, 150);
    this.env.mobiles.push(ball1);

    var gravity = new LocalGravity(ball1, new Vector(0, 100));
    this.env.forces.push(gravity);

    var friction = new LocalFriction(ball1, 0.1);
    this.env.forces.push(friction);

    this.env.forces.push(new Spring(ball1, new Localised(new Vector( width / 3, height / 2)), 150, 10));
    this.env.forces.push(new Spring(ball1, new Localised(new Vector( 2 * width / 3, height / 2)), 150, 10));

    this.mouseForce = new Spring(ball1, new Localised(), 50, 5);
    this.mouseForce.enabled = false;
    this.mouseForce.strokeWeight = 1;
    this.env.forces.push(this.mouseForce);

    // ball2

    var ball2 = new Ball(new Vector(width / 2, height / 2 + ball_space));
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

    var ball3 = new Ball(new Vector(width / 2, height / 2 + 2 * ball_space));
    ball3.mass = 0.2;
    ball3.past_stroke = color(150, 100, 100);
    this.env.mobiles.push(ball3);

    var gravity3 = new LocalGravity(ball3, new Vector(0, 100));
    this.env.forces.push(gravity3);

    var friction3 = new LocalFriction(ball3, 0.1);
    this.env.forces.push(friction3);

    var smm23 = new SpringMobileMobile(ball2, ball3, ball_space, 5);
    this.env.forces.push(smm23);
  }

  draw(draw_forces = true) {
    if (mouseIsPressed) {
      var mouse = new Vector(mouseX, mouseY);
      this.mouseForce.attachment.pos = mouse;
      this.mouseForce.enabled = true;
    } else {
      this.mouseForce.enabled = false;
    }
    this.env.draw_forces = draw_forces;
    this.env.draw();
  }
}
