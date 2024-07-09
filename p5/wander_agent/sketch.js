let vehicle;

function setup() {
  createCanvas(640, 400);
  vehicle = new Vehicle(width / 2, height / 2);
}

function draw() {
  background(255);
  
  vehicle.edges();
  vehicle.wander();
  vehicle.update();
  vehicle.show();
}

class Vehicle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(2, 0);
    this.acceleration = createVector(0, 0);

    this.r = 6;
    this.wandertheta = 0.0;
    this.maxspeed = 2;
    this.maxforce = 0.05;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }
  
  applyForce(force) {
    this.acceleration.add(force);
  }

  wander() {
    let wanderR = 25;
    let wanderD = 80;
    let change = 0.3;
    this.wandertheta += random(-change, change);

    let circlePos = this.velocity.copy();
    circlePos.setMag(wanderD);
    circlePos.add(this.position);
    
    let h = this.velocity.heading();
    
    let circleOffSet = createVector(
      wanderR * cos(this.wandertheta + h),
      wanderR * sin(this.wandertheta + h)
    );
    let target = p5.Vector.add(circlePos, circleOffSet);
    this.seek(target);
    
    this.drawWanderCircle(this.position, circlePos, target, wanderR);
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.position); 
    desired.setMag(this.maxspeed);

    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }

  show() {
    let theta = this.velocity.heading() + PI / 2;
    fill(127);
    stroke(0);
    strokeWeight(2);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
  }

  drawWanderCircle(location, circlePos, target, rad) {
    stroke(0);
    noFill();
    strokeWeight(1);
    circle(circlePos.x, circlePos.y, rad * 2);
    circle(target.x, target.y, 4);
    line(location.x, location.y, circlePos.x, circlePos.y);
    line(circlePos.x, circlePos.y, target.x, target.y);
  }
  
  edges() {
    if (this.position.x > width + this.r) {
      this.position.x = -this.r;
    } else if (this.position.x < -this.r) {
      this.position.x = width + this.r;
    }
    if (this.position.y > height + this.r) {
      this.position.y = -this.r;
    } else if (this.position.y < -this.r) {
      this.position.y = height + this.r;
    }
  }
}