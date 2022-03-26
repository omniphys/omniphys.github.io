---
title: "탄성력"
permalink: /spring/
last_modified_at: 2022-03-26
toc: true
toc_sticky: true
---

## 1. 탄성력의 구현
 금속 용수철이나 고무봉 등은 외부에서 힘이 가해지지 않았을 때 고유의 모양, 1차원적으로만 한정해 보면 자연적인 길이를 갖습니다. 이런 자연스러운 길이는 외부에서 힘이 가해지면 늘어나거나 줄어들게 되는데, 이때 원래 모양으로 돌아오려는 복원력이 작용하게 되며 이런 성질을 탄성이라고 합니다.

 > 많은 탄성체에서는 변형의 정도가 작을 때 복원력과 변형량 사이에 비례관계가 성립(F = -kx) 하는데 이것을 그 발견자인 17 세기 영국 물리학자 로버트 훅의 이름을 기념하여 훅 법칙이라고 부릅니다.

!["뉴턴의 중력법칙"](/assets/images/Hooke's_Law_wikipedia.png){: .align-center}


> ### 활동 1. 간단한 스프링의 구현

탄성력만 작용하는 상황에서 수평으로 움직이는 물체의 운동을 구현해 봅시다.
이 때 탄성력을 벡터로 계산하기 위해서 스프링이 연결된 고정점과 물체의 위치를 벡터로 정의합니다.
용수철의 기본 길이(restLength)에서 변형된 길이 dx에 해당하는 탄성력이 작용하고, 탄성력의 방향은 변형 방향의 반대로 작용합니다.

이를 코드를 표현하면 다음과 같습니다.
벡터의 방향과 크기를 변형할 때는 방향은 크기가 1인 벡터를 만들어 주는 normalize() 함수와 크기만큼 곱해주는 mult() 또는 setMag() 함수를 이용합니다.

```javascript
  // 탄성력 계산
  let force = p5.Vector.sub(pos, anchor);
  let dx = force.mag() - restLength;
  force.normalize();
  force.mult(-1 * k * dx);  // force.setMag(-1 * k * dx)도 가능
```

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500" data-p5-version="1.2.0">
let anchor;     // 고정점 위치 벡터
let pos;        // 물체 위치 벡터
let vel;        // 물체 속도 벡터
let acc;        // 물체 가속도 벡터
let restLength; // 스프링 기본 길이
let m;          // 물체 질량
let k;          // 탄성계수

function setup() {
  createCanvas(100, 100);
  anchor = createVector(10,50);
  pos = createVector(50,50);
  vel = createVector(0,0);
  acc = createVector(0,0);
  restLength = 30;
  m = 10;
  k = 0.1;
}

function draw() {
  background(220);
  
  // 탄성력 계산
  let force = p5.Vector.sub(pos, anchor);
  let dx = force.mag() - restLength;
  force.normalize();
  force.mult(-1 * k * dx);
  
  // 오일러 방법 적용하여 가속도-속도-위치 계산
  acc = force.div(m);
  vel.add(acc);
  pos.add(vel);
  
  // 고정점 표시
  fill(0,0,0);
  circle(anchor.x, anchor.y,5)
  // 스프링 줄 표시
  line(anchor.x, anchor.y, pos.x, pos.y);

  // 물체 표시
  fill(255,255,0,150);
  circle(pos.x, pos.y, 10);
}
</script>


> ### 활동 2. 용수철 진자 구현하기

앞에서 구현한 코드는 벡터로 구현하였기 때문에 2차원 진자 운동에서도 바로 적용이 가능합니다. 

이제 중력과 탄성력이 동시에 작용하는 상황에서 용수철 진자를 구현해 봅시다. 추가적으로 물체를 마우스를 상호작용하는 방법도 함께 알아봅시다.

```javascript
// 오일러 방법 적용하여 가속도-속도-위치 계산
acc = force.div(m);
acc.add(gravity);

vel.add(acc);
pos.add(vel);

// 마우스 상호작용
if (mouseIsPressed) {
pos.x = mouseX;
pos.y = mouseY;
vel.set(0, 0);
}

// 용수철 에너지 손실
vel.mult(0.99);
```

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500" data-p5-version="1.2.0">
let anchor;     // 고정점 위치 벡터
let pos;        // 물체 위치 벡터
let vel;        // 물체 속도 벡터
let acc;        // 물체 가속도 벡터
let restLength; // 스프링 기본 길이
let m;          // 물체 질량
let k;          // 탄성계수
let gravity     // 중력

function setup() {
  createCanvas(100, 100);
  anchor = createVector(50,10);
  pos = createVector(70,30);
  vel = createVector(0,0);
  acc = createVector(0,0);
  gravity = createVector(0,0.1);
  restLength = 30;
  m = 10;
  k = 0.1;
}

function draw() {
  background(220);
  
  // 탄성력 계산
  let force = p5.Vector.sub(pos, anchor);
  let dx = force.mag() - restLength;
  force.normalize();
  force.mult(-1 * k * dx);
  
  // 오일러 방법 적용하여 가속도-속도-위치 계산
  acc = force.div(m);
  acc.add(gravity);
  
  vel.add(acc);
  pos.add(vel);
  
  // 마우스 상호작용
  if (mouseIsPressed) {
    pos.x = mouseX;
    pos.y = mouseY;
    vel.set(0, 0);
  }
  
  // 용수철 에너지 손실
  vel.mult(0.99);
  
  // 고정점 표시
  fill(0,0,0);
  circle(anchor.x, anchor.y,5)
  // 스프링 줄 표시
  line(anchor.x, anchor.y, pos.x, pos.y);

  // 물체 표시
  fill(255,255,0,150);
  circle(pos.x, pos.y, 10);
}
</script>

## 2. 탄성력과 입자계

원자와 원자 또는 분자와 분자 사이에는 전기력이 작용하여 물질의 형태를 유지하게 됩니다. 이는 마치 아래 그림과 같이 전기력이 용수철과 같은 역할을 한다고 볼 수 있는 것입니다. 

이러한 성질을 이용하면 많은 입자로 구성된 물질의 운동도 탄성력으로 시뮬레이션 할 수 있답니다. 

!["뉴턴의 중력법칙"](/assets/images/atom_spring.gif){: .align-center}

> ### 활동 3. 용수철 원자 모형 만들기

물체의 입자를 나타낼 Particle 클래스와 용수철의 기능을 수행할 Spring 클래스를 구현해 용수철 원자 모형을 구현해 봅시다. 

여기서 클래스를 만드는 이유는 많은 입자들에서도 적용하기 위함입니다. 


<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500" data-p5-version="1.2.0">
let atom1;
let atom2;
let spring;

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = 1; 
  }

  applyForce(force) {
    let f = force.copy();
    f.div(this.mass);
    this.acc.add(f);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    
    this.acc.mult(0);
    this.vel.mult(0.99);
  }

  show() {

    fill(255, 255, 0, 150);
    circle(this.pos.x, this.pos.y, 10);
  }
}

class Spring {
  constructor(k, restLength, a, b) {
    this.k = k;
    this.restLength = restLength;
    this.a = a;
    this.b = b;
  }

  update() {
    let force = p5.Vector.sub(this.b.pos, this.a.pos);
    let dx = force.mag() - this.restLength;
    force.normalize();
    force.mult(-1 * this.k * dx);
    this.b.applyForce(force);
    force.mult(-1);
    this.a.applyForce(force);
  }

  show() {
    line(
      this.a.pos.x,
      this.a.pos.y,
      this.b.pos.x,
      this.b.pos.y
    );
  }
}

function setup() {
  createCanvas(100, 100);
  atom1 = new Particle(40, 30);
  atom2 = new Particle(70, 70);
  spring = new Spring(0.01, 30, atom1, atom2);
}

function draw() {
  background(220);
  
  atom1.update();
  atom2.update();
  
  atom1.show();
  atom2.show();
  
  spring.update();
  spring.show();

  if (mouseIsPressed) {
    atom1.pos.set(mouseX, mouseY);
    atom1.vel.set(0, 0);
  }
}
</script>

> ### 활동 4. 유연한 입자계 물질 구현하기

앞의 활동을 확장해서 여러개의 입자를 연결한 용수철 입자계를 만들어 봅시다. 

용수철 입자계는 머리카락, 천 같은 유연한 물체를 시뮬레이션 할 때 적용할 수 있습니다.

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="700" data-p5-version="1.2.0">
let particles = [];
let springs = [];
let spacing = 10;
let k = 0.1;
let gravity;

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = 1; 
    
    this.locked = false;  // 물체가 고정되어 있는지 유무
  }

  applyForce(force) {
    let f = force.copy();
    f.div(this.mass);
    this.acc.add(f);
  }

  update() {
    if (!this.locked) {
      this.vel.add(this.acc);
      this.pos.add(this.vel);

      this.acc.mult(0);
      this.vel.mult(0.99);
    }
  }

  show() {
    fill(255, 255, 0, 150);
    circle(this.pos.x, this.pos.y, 10);
  }
}

class Spring {
  constructor(k, restLength, a, b) {
    this.k = k;
    this.restLength = restLength;
    this.a = a;
    this.b = b;
  }

  update() {
    let force = p5.Vector.sub(this.b.pos, this.a.pos);
    let dx = force.mag() - this.restLength;
    force.normalize();
    force.mult(-1 * this.k * dx);
    this.b.applyForce(force);
    force.mult(-1);
    this.a.applyForce(force);
  }

  show() {
    line(
      this.a.pos.x,
      this.a.pos.y,
      this.b.pos.x,
      this.b.pos.y
    );
  }
}

function setup() {
  createCanvas(100, 600);
  for (let i = 0; i < 20; i++) {
    particles[i] = new Particle(width / 2, i * spacing);
    if (i !== 0) {
      let a = particles[i];
      let b = particles[i - 1];
      let spring = new Spring(k, spacing, a, b);
      springs.push(spring);
    }
  }
  
  particles[0].locked = true;

  gravity = createVector(0, 0.1);
}

function draw() {
  background(220);
  
  for (let p of particles) {
    p.applyForce(gravity);
    p.update();
    p.show();
  }

  for (let s of springs) {
    s.update();
    s.show();
  }

  let tail = particles[particles.length - 1];
  

  if (mouseIsPressed) {
    tail.pos.set(mouseX, mouseY);
    tail.vel.set(0, 0);
  }
}
</script>
