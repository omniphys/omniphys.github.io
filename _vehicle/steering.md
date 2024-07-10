---
title: "자율 에이전트와 조향"
permalink: /vehicle/steering/
excerpt: "자율 에이전트의 개념과 조향 행동"
last_modified_at: 2024-07-07
toc: true
toc_sticky: true
---

## 1. 자율 에이전트 (Autonomous Agents)
자율 에이전트는 일반적으로 계획된 환경에 의해서 영향을 받는 것이 아니라, 스스로가 환경 내부에서 어떤 행동을 할지 결정하는 객체를 의미합니다. 자율 에이전트에는 다음과 같이 3가지 중요한 구성 요소를 가집니다.

{% capture notice-text1 %}
* 생명체는 주변 환경을 인식하면서 한정된 정보를 활용하여 살아갑니다. 예를 들어 현실 세계의 곤충은 자신 주변의 한정된 시야와 진동, 냄새를 인식하여 생존해나갑니다.
{% endcapture %}
<div class="notice--warning">
  <h4 class="no_toc">자율 에이전트에는 주변 환경을 인식하는 한정된 능력이 있다.</h4>
  {{ notice-text1 | markdownify }}
</div>

{% capture notice-text2 %}
* 행동은 물리학적으로 힘과 운동으로 표현할 수 있으므로 물리 엔진에서 사용했던 수치 해석을 적용할 수 있습니다. 예를 들어 '굉장히 큰 상어가 다가오고 있다'는 정보를 얻었을때 그 개체가 할 수 있는 행동은 반대 방향으로 힘을 주어 최대한 빨리 도망가는 것입니다. 반대로 먹이를 발견한 개체는 먹이 방향으로 이동하기 위한 행동을 취하기 위해 적절한 힘을 작용할 것입니다.   
{% endcapture %}
<div class="notice--warning">
  <h4 class="no_toc">자율 에이전트는 주변 환경으로부터 얻은 정보를 처리하여 행동을 결정한다.</h4>
  {{ notice-text2 | markdownify }}
</div>

{% capture notice-text3 %}
* 여러 개체가 모여있는 집단에서는 대체적으로 명령을 내리는 리더가 존재하지 않습니다. 리더가 없이도 각 개체들이 서로 상호작용하며 지능적이고 구조화된 행동이 나타날 수 있습니다.
{% endcapture %}
<div class="notice--warning">
  <h4 class="no_toc">자율 에이전트는 리더라는 개념이 없다.</h4>
  {{ notice-text3 | markdownify }}
</div>

## 2. 조향력 (Steering Force)
조향력은 자율 에이전트가 행동의 목적을 달성하기 위해 작용하는 힘이라고 생각하면 됩니다. 예를 들어 아래 그림과 같이 이동하던 개체(자율 에이전트)이 좋아하는 딸기(목표)를 발견했을 때 어떻게 조향력을 작용해야 딸기에 도달할 수 있을까요?

개체의 목적과 목적에 따른 행동은 아래 목표를 찾아 움직이는 것입니다. 단순하게 중력처럼 개체가 목표에 끌려가게 구현할 수 도 있지만, 자율 에이전트는 스스로의 상태와 환경(현재의 이동속도 등)을 인식하고 이를 기반으로 목표를 향해 조향(속도를 결정)하게 됩니다. 

!["속도와 목표가 있는 자율 에이전트"](/assets/images/steering_01.png){: .align-center width="80%" height="80%"}

개체는 스스로가 어떻게 이동하고 싶은지를 인식하고(목표를 향하는 벡터를 구하고) 해당 목표와 현재의 이동 속도를 비교해 조향력을 결정하게 됩니다. 이 때 조향력은 목표를 향한 속도 벡터에서 현재 이동 속도 벡터의 차로 구할 수 있습니다. 

> 조향력  = 원하는 속도 - 현재 속도

p5.js 코드로는 다음과 같이 표현할 수 있습니다.

```javascript
let steer = p5.Vector.sub(desired, velocity);
```
이 때 개체의 속도(velocity)는 개체의 변수값에서 바로 알 수 있으며, 원하는 속도(desired)는 현재 위치에서 목표의 위치를 향하는 벡터로 표현할 수 있습니다.

```javascript
let desired = p5.Vector.sub(target, position);
```

!["목표지점"](/assets/images/steering_02.png){: .align-center width="80%" height="80%"}

그렇지만 원하는 속도(desired)의 크기를 제한하지 않으면 개체와 목표가 멀리 떨어져 있으면 너무 강한 힘이 작용해 순간이동하는 모습을 볼 수도 있습니다. 이러한 상황은 현실적이지 않기 때문에 다음 그림과 같이 적정한 크기의 원하는 속도의 크기로 설정해야 하며, 개체가 자신이 움직일 수 있는 나름대로의 최대 속도로 목표를 향해 움직이게 합니다. 

!["최대 속도의 제한"](/assets/images/steering_03.png){: .align-center width="80%" height="80%"}

p5.js 코드로 원하는 속도의 크기를 다음과 같이 수정하여 표현할 수 있습니다.

```javascript
let desired = p5.Vector.sub(target, this.position);
desired.setMag(this.maxspeed);
```

이를 통해 그림과 같이 조향력을 결정할 수 있습니다. 자율 에이전트의 능력에는 한계가 있기 때문에 조향력 자체의 크기에도 한계가 있습니다. 그래서 조향력의 최대값을 정해 조향력이 그 최대값 이상 값을 갖지 못하도록 설정해야 합니다.

!["조향력의 계산"](/assets/images/steering_04.png){: .align-center width="80%" height="80%"}

지금까지 내용을 바탕으로 조향력을 계산하는 클래스의 메서드 seek()를 다음과 같이 구현할 수 있습니다. 

```javascript
 seek(target) {
    let desired = p5.Vector.sub(target,this.position);  // 원하는 속도 벡터
    desired.setMag(this.maxspeed);                      // 원하는 속도를 최대값으로 결정
    let steer = p5.Vector.sub(desired, this.velocity);  // 조향력 벡터
    steer.limit(this.maxforce);                         // 조향력의 크기 범위를 결정
    this.applyForce(steer);                             // 물리엔진의 힘을 결정
  }
```

조향력의 최대 크기(maxforce)에 따라 개체의 경로는 아래와 같이 달라지게 되며, 구현하려고 하는 자연적 현상을 가장 잘 표현하는 조향력의 최대 크기를 상황에 맞게 설정하면 됩니다.

!["조향력의 크기에 따른 경로"](/assets/images/steering_05.png){: .align-center width="80%" height="80%"}



> ### 활동 1. 목표를 추적하는 자율 에이전트

마우스에 따라 움직이는 목표를 향해 지속적으로 조향하는 자율 에이전트를 구현해 봅시다.

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

  vehicle.seek(mouse);
  vehicle.update();
  vehicle.show();
}

class Vehicle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.r = 2;
    this.maxspeed = 2;
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

  seek(target) {
    let desired = p5.Vector.sub(target, this.position); 
    desired.setMag(this.maxspeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    this.applyForce(steer);
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
}
</script>

> ### 활동 2. 목표를 회피하는 자율 에이전트

마우스에 따라 움직이는 목표를 회피하는 자율 에이전트를 구현해 봅시다. 기존의 Vehicle 클래스에 원하는 속력을 반대로 설정하여 도망가게 하는 flee() 메소드를 추가하고 seek() 메소드를 다음과 같이 수정할 수 있습니다.

```javascript
  flee(target) {
    return this.seek(target).mult(-1);
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.position);
    desired.setMag(this.maxspeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  }
```

그리고 자율 에이전트가 계속 스크린에 나타나도록 스크린 경계를 벗어나면 반대편 경계에서 나타나도록 하는 edges() 메소드 코드를 추가해보겠습니다.

```javascript
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
```

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="800" data-p5-version="1.2.0">
let vehicle;

function setup() {
  createCanvas(100, 100);
  vehicle = new Vehicle(width / 2, height / 2);
}

function draw() {
  background(200);

  fill(255, 0, 0);
  noStroke();
  let mouse = createVector(mouseX, mouseY);
  fill(127);
  stroke(0);
  strokeWeight(2);
  circle(mouse.x, mouse.y, 10);

  let steering = vehicle.flee(mouse);
  vehicle.applyForce(steering);

  vehicle.edges();
  vehicle.update();
  vehicle.show();
}

class Vehicle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.r = 2;
    this.maxspeed = 2;
    this.maxforce = 0.1;
  }

  flee(target) {
    return this.seek(target).mult(-1);
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.position);
    desired.setMag(this.maxspeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
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
</script>

## 3. 벽 안에 머무르기 
활동 2에서는 자율 에이전트가 경계를 벗어나면 반대쪽에서 나타나도록 코드를 구현하였습니다. 만약 벽의 내부에서 벗어나지 말기라는 조향 행동을 만들고 싶다면 어떻게 하면 될까요?

그림과 같이 벽을 설정해서 '원하는 속도(desired)'를 다음과 같이 정의할 수 있습니다.

> 자율 에이전트는 벽으로부터 거리 d만큼 가까워지면 최대속력으로 벽의 반대 방향으로 달아나려는 본능을 가진다.

이러한 조향 행동을 기존 Vehicle 클래스의 boundaries() 메소드로 구현해 보겠습니다.

```javascript
 boundaries(offset) {
    let desired = null;
    if (this.position.x < offset) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - offset) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }
    if (this.position.y < offset) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - offset) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }
    if (desired !== null) {
      desired.setMag(this.maxspeed);
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }
```
> ### 활동 3. 벽의 내부에서 벗어나지 않는 자율 에이전트

화면 경계를 벗어나지 않는 자율 에이전트를 구현해 봅시다.

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="800" data-p5-version="1.2.0">
let vehicle;
let offset = 10;

function setup() {
  createCanvas(100, 100);
  vehicle = new Vehicle(width / 2, height / 2);
}

function draw() {
  background(200);

  stroke(0);
  noFill();
  rectMode(CENTER);
  rect(width / 2, height / 2, width - offset * 2, height - offset * 2);

  vehicle.boundaries(offset);
  vehicle.update();
  vehicle.show();
}

class Vehicle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(1, 1.3);
    this.acceleration = createVector(0, 0);
    this.r = 2;
    this.maxspeed = 1;
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

  boundaries(offset) {
    let desired = null;
    if (this.position.x < offset) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - offset) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }
    if (this.position.y < offset) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - offset) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.setMag(this.maxspeed);
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
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
}
</script>