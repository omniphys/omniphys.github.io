---
title: "충돌의 물리학"
permalink: /collision/
last_modified_at: 2021-05-01
toc: true
toc_sticky: trueß
---

우리는 지금까지 벡터, 힘과 운동, 만유인력, 입자계 등 여러 물리학 개념들을 프로그램으로 구현해 보았습니다. 그러나 잘 생각해 보면 정말 중요한 충돌에 대해서는 거의 살펴본 적이 없었네요. 

물론 전혀 없었던 것은 아니었습니다. 공이 바닥에 충돌하여 튀어오르는 상황을 구현해 본적이 있는데 기억나시죠? 앞으로 다뤄볼 충돌은 바닥과의 충돌보다 복잡한 입자들 사아의 충돌을 다뤄보려고 합니다. 그러기 위해서는 다음과 같은 두가지 알고리즘을 구현해야 합니다.

> 1. 두 물체가 충돌했다는 것을 어떻게 확인할 것인가?
> 2. 두 물체의 충돌 후 속도는 어떻게 구할 것인가? 

## 1. 충돌 감지
첫 번째 충돌 감지는 어떻게 알 수 있을까요? 일단 제일 간단한 두 공이 2차원으로 충돌하는 상황을 살펴보겠습니다. 
충돌을 감지하기 위해서는 두 공 사이의 거리를 구해야 하는데 이는 공의 중심좌표의 차이를 통해 피타고라스 공식으로 구할 수 있습니다. 

!["두 공의 충돌"](/assets/images/circle-circle-collision.png){: .align-center width="70%" height="70%"}

하지만 우리는 p5.js 에서 제공하는 벡터 기능을 활용하면 더 쉽게 공의 중심 사이 거리를 구할 수 있습니다. 이러한 방법은 이미 만유인력을 구할 때 사용했던 방법입니다.

> 1. 두 공의 중심 위치를 벡터로 나타내고 Vector.sub()함수를 이용하여 두 벡터의 차를 구하여 두 공의 중심을 잇는 벡터를 구합니다. 
> 2. p5.js의 벡터 기능 중에 mag()함수를 이용하여 벡터의 크기를 구하면 두 점 사이의 거리가 나오게 됩니다.
> 3. 두 공 중심사이의 거리가 두 공의 반지를 합보다 작으면 충돌했다고 볼 수 있습니다.

간략하게 의사 코드로 나타내면 다음과 같습니다.

```javascript
충돌 감지 함수() {
    공1의 반지름 = 30;
    공2의 반지름 = 50;
    공1 중심위치벡터 = createVector(100,100);
    공2 중심위치벡터 = createVector(150,170);

    두 공 중심을 잇는 벡터 = p5.Vector.sub(공2 중심위치벡터, 공1 중심위치벡터);
    두 공 중심 사이 거리 = 두 공 중심을 잇는 벡터.mag(); 
    두 공 반지름 합 = 공1의 반지름 + 공2의 반지름;
    if (두 공 중심 사이 거리 <= 두 공 반지름 합) {
        충돌!!!
    }
}
```

그럼 지난 4차시의 만유인력 구현 코드를 약간 수정하여 공의 충돌감지 코드를 작성해보겠습니디.

> ### 활동 1. 공의 충돌 감지하기 

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500" data-p5-version="1.2.0">
let balls = [];

class Ball{
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.m = m;
    this.r = this.m * 5;
    this.e = 1;
    this.isColliding = false;
  }
  
  collisionDetection(other) {
    let distanceVec = p5.Vector.sub(other.pos, this.pos);
    let distance = distanceVec.mag();
    let sumRadius = this.r + other.r;
    
    if (distance < sumRadius) {
      this.isColliding = true;
      other.isColliding = true; 
    }
  }
  
  applyForce(force) {
    let f = p5.Vector.div(force, this.m);
    this.acc.add(f);
  }
  
  edge() {
    if (this.pos.x > width - this.r) {
      this.pos.x = width - this.r;
      this.vel.x *= -1;
    } else if (this.pos.x < this.r) {
      this.pos.x = this.r;
      this.vel.x *= -1;
    } else if (this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y *= -1;
    } else if (this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y *= -1;
    }
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }
  
  show() {
    if (this.isColliding) {
      fill(255,0,0,100);
    } else {
      fill(200);
    }
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    
  }
}

function setup() {
  createCanvas(100, 100);
  for (let i=0; i < 5; i++) {
    balls[i] = new Ball(random(width), random(height), random(1,2));
  }
}

function draw() {
  background(220);
  let gravity = createVector(0, 0.2);
  
  for (let i = 0; i < balls.length; i++) {
    balls[i].isColliding = false;
  }
  
  for (let i = 0; i < balls.length; i++) {
    for (let j = i+1; j < balls.length; j++) {
      
        balls[i].collisionDetection(balls[j]);
      
    }
    //balls[i].applyForce(gravity);
    balls[i].edge();
    balls[i].update();
    balls[i].show();
  }
}
</script>

> ### 활동 2. 공의 충돌 구현하기 (운동량 보존과 운동에너지 보존을 활용) 

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500" data-p5-version="1.2.0">
let balls = [];
const e = 1;

class Ball{
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.m = m;
    this.r = this.m * 5;
    this.isColliding = false;
  }
  
  collisionDetection(other) {
    let displacement = p5.Vector.sub(other.pos, this.pos);
    let distance = displacement.mag();
    let sumRadius = this.r + other.r;
    
    if (distance < sumRadius) {
      this.isColliding = true;
      other.isColliding = true;
            
      let m1 = this.m;
      let m2 = other.m;
      let u1 = this.vel;
      let u2 = other.vel
      
      let v1_x = ((e + 1) * m2 * u2.x + u1.x * (m1 - e * m2))/(m1 + m2);
      let v1_y = ((e + 1) * m2 * u2.y + u1.y * (m1 - e * m2))/(m1 + m2);
      let v2_x = ((e + 1) * m1 * u1.x + u2.x * (m2 - e * m1))/(m1 + m2);
      let v2_y = ((e + 1) * m1 * u1.y + u2.y * (m2 - e * m1))/(m1 + m2);
      
      this.vel = createVector(v1_x,v1_y);
      other.vel = createVector(v2_x,v2_y);
       
    }
  }
  
  applyForce(force) {
    let f = p5.Vector.div(force, this.m);
    this.acc.add(f);
  }
  
  edge() {
    if (this.pos.x > width - this.r) {
      this.pos.x = width - this.r;
      this.vel.x *= -1;
    } else if (this.pos.x < this.r) {
      this.pos.x = this.r;
      this.vel.x *= -1;
    } else if (this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y *= -1;
    } else if (this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y *= -1;
    }
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }
  
  show() {
    if (this.isColliding) {
      fill(255,0,0,100);
    } else {
      fill(200);
    }
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    
  }
}

function setup() {
  createCanvas(100, 100);
  for (let i=0; i < 3; i++) {
    balls[i] = new Ball(random(width), random(height), random(1,2));
  }
}

function draw() {
  background(220);
  let gravity = createVector(0, 0.2);
  
  for (let i = 0; i < balls.length; i++) {
    balls[i].isColliding = false;
  }
  
  for (let i = 0; i < balls.length; i++) {
    for (let j = i+1; j < balls.length; j++) {
      
        balls[i].collisionDetection(balls[j]);
      
    }
    //balls[i].applyForce(gravity);
    balls[i].edge();
    balls[i].update();
    balls[i].show();
    
  }
}
</script>

> ### 활동 3. 공의 충돌 개선하여 구현하기 (크기를 고려) 

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500" data-p5-version="1.2.0">
let balls = [];
const e = 1;

class Ball{
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.m = m;
    this.r = this.m * 5;
    this.isColliding = false;
  }
  
  collisionDetection(other) {
    let displacement = p5.Vector.sub(other.pos, this.pos);
    let distance = displacement.mag();
    let sumRadius = this.r + other.r;
    
    if (distance < sumRadius) {
      this.isColliding = true;
      other.isColliding = true;
      
      // 위치 보정
      let distanceCorrection = (sumRadius - distance) / 2.0;
      let d = displacement.copy();
      let correctionVector = d.normalize().mult(distanceCorrection);
      other.pos.add(correctionVector);
      this.pos.sub(correctionVector);

      let n = displacement.copy();
      let normal = n.normalize();
            
      let m1 = this.m;
      let m2 = other.m;
      
      let u1 = this.vel.x * normal.x + this.vel.y * normal.y;
      let u2 = other.vel.x * normal.x + other.vel.y * normal.y;

      let v1 = ((e + 1) * m2 * u2 + u1 * (m1 - e * m2))/(m1 + m2);
      let v2 = ((e + 1) * m1 * u1 + u2 * (m2 - e * m1))/(m1 + m2);
        
      let normalVel1 = p5.Vector.mult(normal,u1);
      let normalVel2 = p5.Vector.mult(normal,u2);
      
      let tangentVel1 = p5.Vector.sub(this.vel, normalVel1);
      let tangentVel2 = p5.Vector.sub(other.vel, normalVel2);
      
      normalVel1.normalize().mult(v1);
      normalVel2.normalize().mult(v2);
      
      this.vel = p5.Vector.add(normalVel1, tangentVel1);
      other.vel = p5.Vector.add(normalVel2, tangentVel2);
       
    }
  }
  
  applyForce(force) {
    let f = p5.Vector.div(force, this.m);
    this.acc.add(f);
  }
  
  edge() {
    if (this.pos.x > width - this.r) {
      this.pos.x = width - this.r;
      this.vel.x *= -1;
    } else if (this.pos.x < this.r) {
      this.pos.x = this.r;
      this.vel.x *= -1;
    } else if (this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y *= -1;
    } else if (this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y *= -1;
    }
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }
  
  show() {
    if (this.isColliding) {
      fill(255,0,0,100);
    } else {
      fill(200);
    }
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    
  }
}

function setup() {
  createCanvas(100, 100);
  for (let i=0; i < 5; i++) {
    balls[i] = new Ball(random(width), random(height), random(1,2));
  }
}

function draw() {
  background(220);
  let gravity = createVector(0, 0.2);
  
  for (let i = 0; i < balls.length; i++) {
    balls[i].isColliding = false;
  }
  
  for (let i = 0; i < balls.length; i++) {
    for (let j = i+1; j < balls.length; j++) {
      
        balls[i].collisionDetection(balls[j]);
      
    }
    //balls[i].applyForce(gravity);
    balls[i].edge();
    balls[i].update();
    balls[i].show();
    
  }
}
</script>


