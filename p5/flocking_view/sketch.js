const flock = [];

function setup() {
  createCanvas(640, 400);
  seperationSlider = createSlider(0, 2, 1.5, 0.1);
  alignSlider = createSlider(0, 2, 1.0, 0.1);
  cohesionSlider = createSlider(0, 2, 1.0, 0.1);
  viewSlider = createSlider(0, 2, 0, 0.1);

  for (let i = 0; i < 300; i++) {
    flock.push(new Boid(width / 2, height / 2));
  }

}

function draw() {
  background(220);
  fill(0)
  textSize(20);
  text('Seperation', 10, height - 10);
  text('Align', 140, height - 10);
  text('Cohesion', 270, height - 10);
  text('View', 400, height - 10);
  
  for (let boid of flock) {
    boid.flock(flock);
    boid.update();
    boid.edges();
    boid.show();
  }
}

class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.acceleration = createVector(0, 0);
    this.r = 5.0;
    this.maxspeed = 3; 
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
  
  flock(boids) {
    let seperation = this.seperate(boids);
    let alignment = this.align(boids);
    let cohesion = this.cohere(boids);
    let viewing = this.view(boids);
    
    seperation.mult(seperationSlider.value());
    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    viewing.mult(viewSlider.value());

    
    this.applyForce(seperation);
    this.applyForce(alignment);
    this.applyForce(cohesion);
    this.applyForce(viewing);
  }
  
  seperate(boids) {
    let desiredSeparation = 25;
    let sum = createVector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if (d > 0 && d < desiredSeparation) {
        let diff = p5.Vector.sub(this.position, boids[i].position);
        diff.normalize();
        diff.div(d);
        sum.add(diff);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
    }
    if (sum.mag() > 0) {
      sum.setMag(this.maxspeed);
      let steer = p5.Vector.sub(sum,this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return sum;
    }  
  }
  
  align(boids) {
    let neighborDistance = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if (d > 0 && d < neighborDistance) {
        sum.add(boids[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.setMag(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }
  
  cohere(boids) {
    let neighborDistance = 50;
    let sum = createVector(0, 0); // Start with empty vector to accumulate all locations
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if (d > 0 && d < neighborDistance) {
        sum.add(boids[i].position); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      let desired = p5.Vector.sub(sum, this.position); 
      desired.setMag(this.maxspeed);
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0);
    }  
  }
  
  view(boids) {
    let viewAngle = radians(45);
    let viewDistance = 50;
    let lateralMove = createVector(this.velocity.y,-this.velocity.x).normalize();
    let steer = createVector(0, 0);
    let blocking = false;
    for (let other of boids) {
      let difference = p5.Vector.sub(other.position, this.position);
      let distance = difference.mag();
      let angle = this.velocity.angleBetween(difference);
      if (
        other !== this &&
        distance < viewDistance &&
        Math.abs(angle) < viewAngle
      ) {
        blocking = true;
        if (angle < 0) {
          steer.sub(lateralMove);
        } else {
          steer.add(lateralMove);
        }
      }
    }

    if (blocking) {
      steer.setMag(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }

    return steer;
  }
  
  show() {
    let angle = this.velocity.heading();
    fill(127);
    stroke(0);
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    beginShape();
    vertex(this.r * 2, 0);
    vertex(-this.r * 2, -this.r);
    vertex(-this.r * 2, this.r);
    endShape(CLOSE);
    pop();
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