class PhysVector {
  constructor(base, vec, color, label) {
    this.base = base;
    this.vec = vec;
    this.color = color;
    this.label = label;
    this.offsetX1 = 0;
    this.offsetY1 = 0;
    this.offsetX2 = 0;
    this.offsetY2 = 0;
    this.dragging = false; // Is the object being dragged?
    this.rollover = false; // Is the mouse over the ellipse?
    this.resizing = false;
  }

  draw() {
    push();
    stroke(this.color);
    strokeWeight(2);
    fill(this.color);
    translate(this.base.x, this.base.y);
    //draw line
    line(0, 0, this.vec.x, this.vec.y);
    rotate(this.vec.heading());
    let arrowSize = 7;
    translate(this.vec.mag() - arrowSize, 0);
    //draw arrow
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();

    //draw label...
    this.label.position(this.base.x + (this.vec.x / 2), this.base.y + (this.vec.y / 2));
  }

  drawDecomposition() {
    push();
    stroke(100);
    strokeWeight(1);
    translate(this.base.x, this.base.y);
    line(0, 0, 0, this.vec.y);
    translate(0, this.vec.y);
    let a = atan2(0, this.vec.y);
    rotate(a);
    // Triangle Arrow
    let offset = 10
    fill(100);
    noStroke();
    triangle(-offset * 0.3, -offset, offset * 0.3, -offset, 0, 0);
    pop();

    push();
    stroke(100);
    strokeWeight(1);
    translate(this.base.x, this.base.y);
    line(0, 0, this.vec.x, 0);
    translate(this.vec.x, 0);
    let b = atan2(-this.vec.x, 0);
    rotate(b);
    // Triangle Arrow
    fill(100);
    noStroke();
    triangle(-offset * 0.3, -offset, offset * 0.3, -offset, 0, 0);
    pop();

  }

  getDistance() {
    let b = createVector(this.base.x, this.base.y);
    let v = p5.Vector.add(this.base, this.vec);
    let m = createVector(mouseX, mouseY);

    //orthognal projection 
    let d1 = p5.Vector.sub(v, b);
    let d2 = p5.Vector.sub(m, b);
    let l1 = d1.mag();

    let dotp = constrain(d2.dot(d1.normalize()), 0, l1);

    let op = p5.Vector.add(b, d1.mult(dotp));
    return p5.Vector.dist(m, op);
  }

  over() {
    // Is mouse over object
    let d1 = this.getDistance();
    
    if (d1 < 10) {
      this.drawDecomposition();
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  }

  update() {
    
    if (this.dragging) {
      cursor(MOVE);
      this.base.x = round(((mouseX) + this.offsetX1) / 40) * 40;
      this.base.y = round(((mouseY) + this.offsetY1) / 40) * 40;
    } 
    
    if (this.resizing) {
      cursor(HAND);
      this.vec.x = round(((mouseX) - this.base.x + this.offsetX2) / 40) * 40;
      this.vec.y = round(((mouseY) - this.base.y + this.offsetY2) / 40) * 40;
      // 벡터합 업데이트
      vectors[2].vec = p5.Vector.add(vectors[0].vec, vectors[1].vec);
    }
  }

  pressed() {
    let d1 = this.getDistance();
    let transVec = p5.Vector.add(this.base, this.vec);
    // from arrow to mouse position
    let d2 = int(dist(transVec.x, transVec.y, mouseX, mouseY));

    if (d1 < 10 && d2 < 10) {
      this.resizing = true;
      this.dragging = false;
      this.offsetX2 = transVec.x - (mouseX);
      this.offsetY2 = transVec.y - (mouseY);
    } else if (d1 < 10) {
      this.dragging = true;
      this.resizing = false;
      this.offsetX1 = this.base.x - (mouseX);
      this.offsetY1 = this.base.y - (mouseY);
    }
  }

  released() {
    // Quit dragging & resizing
    this.dragging = false;
    this.resizing = false;
    cursor(ARROW);
  }
}