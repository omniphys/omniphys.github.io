---
title: "도착 및 배회"
permalink: /vehicle/arrive/
excerpt: "자율 에이전트의 도착 및 배회 행동"
last_modified_at: 2024-07-08
toc: true
toc_sticky: true
---

## 1. 도착(arrive) 행동
자율 에이전트가 목표를 향해 움직이다가 목표에 가까워질수록 속도를 줄여야 하는 상황이 되면 어떻게 해야 할까요? 예를 들어 꽃을 발견한 벌이 꽃에 앉기 위해서는 꽃과의 거리와 속도를 고려해야 합니다. 그렇지 않으면 목표물을 지나치고 말테니까요. 목표를 발견하고 도달하는 과정에서 자율 에이전트의 머리 속의 사고 과정을 나타내면 다음과 같을 것 입니다. 

!["도착행동"](/assets/images/arrive_01.png){: .align-center width="80%" height="80%"}

> 1. 많이 멀잖아! 가능한 한 빠르게 목표를 찾아 움직여야 해!
> 2. 그래도 조금 멀잖아! 가능한 한 빠르게 목표를 찾아 움직여야 해! 
> 3. 조금 가까워 졌으니 조금 느리게 접근하자!
> 4. 곧 도착이다! 가능한 한 느리게 접근하자!
> 5. 도착했다! 정지!

이러한 상황을 구현하기 위해 우리는 목표물을 중심으로 반경 r인 원을 상상해봅시다. 원 밖에서 자율 에에전트의 원하는 속도 크기는 최대 속도로 설정됩니다. 차량이 원에 들어가 목표에 접근함에 따라 '원하는 속도(desired)'를 줄여 목표지점에서 속력이 0이 되게 만듭니다.

!["도착행동"](/assets/images/arrive_02.png){: .align-center width="80%" height="80%"}

도착 행동에는 조향력 = 원하는 속도(desired) - 현재속도(velocity) 의 관계식을 사용합니다. 조향력은 본질적으로 현재 속도의 오차를 나타낸다고 볼 수 있으며, 이러한 오차를 스스로 인식하고 조향력을 적용함으로써 보다 동적으로 살아있는 생명체와 같은 시뮬레이션을 만들 수 있게 됩니다. 

!["도착행동"](/assets/images/arrive_03.png){: .align-center width="80%" height="80%"}

이러한 도착행동을 클래스의 arrive() 메소드로 다음과 같이 구현할 수 있습니다.

```javascript
arrive(target) {
    let desired = p5.Vector.sub(target, this.position); 
    let d = desired.mag();
    if (d < 100) {
        let m = map(d, 0, 100, 0, this.maxspeed);
        desired.setMag(m);
    } else {
        desired.setMag(this.maxspeed);
    }
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);  
    this.applyForce(steer);
}
```

> ### 활동 1. 목표에 도착하는 자율 에이전트

목표에 도착하는 자율 에이전트를 구현해 봅시다.

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="800" data-p5-version="1.2.0">
let vehicle;

function setup() {
  createCanvas(100, 100);
  vehicle = new Vehicle(width / 2, height / 2);
}

function draw() {
  background(200);
  let mouse = createVector(mouseX, mouseY);
  fill(127);
  stroke(0);
  strokeWeight(2);
  circle(mouse.x, mouse.y, 10);

  vehicle.arrive(mouse);
  vehicle.update();
  vehicle.show();
}

class Vehicle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, -2);
    this.acceleration = createVector(0, 0);
    this.r = 2;
    this.maxspeed = 4;
    this.maxforce = 0.1;
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

  arrive(target) {
    let desired = p5.Vector.sub(target, this.position); 
    let d = desired.mag();
    if (d < 100) {
      let m = map(d, 0, 100, 0, this.maxspeed);
      desired.setMag(m);
    } else {
      desired.setMag(this.maxspeed);
    }
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);  
    this.applyForce(steer);
  }

  show() {
    let angle = this.velocity.heading();
    fill(127);
    stroke(0);
    strokeWeight(2);
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
}
</script>

## 2. 배회(wander) 행동
배회는 어느 정도 긴 시간동안 임의 상태를 가지는 조향으로 특정한 시점에서의 조향 방향은 다음 시점의 조향 방향과 관계를 가집니다. 미래의 위치에서 임의 조향 방향을 생성하면 해도 단순한 임의 운동이 아니라 생명체가 배회하는 듯한 의미 있는 움직임이 나타납니다. 아래 그림과 같이 자율 에이전트가 자신이 잠시 후에 있을 위치를 기준으로 반경 r의 원을 그리고 그 해당 원의 둘레 위에서 임의의 점을 하나 선택합니다. 이 때 선택된 임의의 점이 에니메이션의 각 프레임에서 목표지점이 되어 자율 에이전트를 조향합니다.

!["배회행동"](/assets/images/wander_01.png){: .align-center width="50%" height="50%"}

랜덤하게 자율 에이전트를 조향하고 있지만 랜덤하게 선택되는 점을 미래의 워치의 원 둘레로 한정함으로써 에이전트의 움직임이 아래 시뮬레이션처럼 마구잡이처럼 보이지 않게 됩니다. 

<p align="center">
<iframe src="/p5/wander_agent/" width="640" height="400" frameborder="0"></iframe>
</p>

> ### 활동 2. 배회하는 자율 에이전트

아래 코드를 참고해 배회하는 자율 에이전트를 구현해 봅시다.

```javascript
let vehicle;

function setup() {
  createCanvas(640, 400);
  vehicle = new Vehicle(width / 2, height / 2);
}

function draw() {
  background(200);
  
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
```

> 오늘의 과제 
> 
> 벽 안에서 배회하는 자율 에이전트를 구현해 보세요.
<p align="center">
<iframe src="/p5/wander_wall/" width="640" height="400" frameborder="0"></iframe>
</p>