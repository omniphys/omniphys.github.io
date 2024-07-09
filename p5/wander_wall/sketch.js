let vehicle;
let offset = 25;
let c;

function setup() {
  createCanvas(640, 400);
  vehicle = new Vehicle(width / 2, height / 2);
  c=color(127)
}

function draw() {
  background(255);
  
  stroke(0);
  noFill();
  rectMode(CENTER);
  rect(width / 2, height / 2, width - offset * 2, height - offset * 2);
  
  //vehicle.edges();
  vehicle.boundaries(offset);
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
    let change = 0.2;
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
    c=color(127);
  }
  
  evadeWall(desired) {
    desired.setMag(this.maxspeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce * 3);
    this.applyForce(steer);
    c = color('red')
  }

  show() {
    let theta = this.velocity.heading() + PI / 2;
    fill(c);
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
  
  boundaries(offset) {
    let desired = null;
    let isBoundary = false;
    if (this.position.x < offset) {
      desired = createVector(this.maxspeed, this.velocity.y);
      this.evadeWall(desired);
      isBoundary = true;
    } else if (this.position.x > width - offset) {
      desired = createVector(-this.maxspeed, this.velocity.y);
      this.evadeWall(desired);
      isBoundary = true;
    } 
            
    if (this.position.y < offset) {
      desired = createVector(this.velocity.x, this.maxspeed);
      this.evadeWall(desired);
      isBoundary = true;

    } else if (this.position.y > height - offset) {
      desired = createVector(this.velocity.x, -this.maxspeed);
      this.evadeWall(desired);
      isBoundary = true;
    } 
    
    if (!isBoundary) {
      this.wander();
    }
  }
}