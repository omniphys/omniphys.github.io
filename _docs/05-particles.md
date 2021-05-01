---
title: "입자계 물리"
permalink: /particles/
last_modified_at: 2021-04-28
toc: true
toc_sticky: true
---

## 1. 입자계 시스템

유명한 물리학자 리처드 파인만은 모든 지식이 파괴된 인류에게 단 한 문장만 전할 수 있다면 무엇을 전하겠냐는 질문에 이렇게 답했다고 합니다.

> 모든 물질은 원자로 이루어져 있다.

이 말이 중요한 이유는 원자의 관점에서 세상을 보지 않으면 제대로 물질 세계를 이해할 수 없다는 뜻이기도 합니다. 과학의 시작은 원자론에서부터 시작되었다고 해도 과언이 아닙니다. 모든 물질은 원자로 이루어져 있고 모든 물체의 운동도 각 입자의 운동의 합으로 설명할 수 있습니다.

그러나 우리가 물리학 시간에 물체의 운동도 분석할 때 쉽게 접근하기 위해 물체를 하나의 입자로 가정하고 설명해 왔습니다. 그러나 모든 물체는 부피를 가지고 수많은 원자로 구성되어 있어 실제 자연현상을 컴퓨터로 시뮬레이션 하기 위해서는 여러 입자의 운동을 입자계 시스템으로 표현할 필요가 있습니다. 

특히 불, 물, 연기와 같은 유체의 운동을 표현하기 위해서는 한 두개의 입자가 아닌 입자계 시스템을 사용합니다.

!["파티클 효과"](/assets/images/particle_effect.jpg){: .align-center}

우리는 앞선 차시에서 클래스와 객체, 배열, 반복문에 대해서 배웠습니다. 입자계 시스템을 만들 때도 바로 클래스, 객체, 배열, 반복문을 사용합니다. 그럼 활동 1을 통해 분수를 만들어볼까요?

분수를 만들기 위해서 다음과 같이 Particle 클래스와 실행 부분을 구상해 봅시다. 이렇게 직접 코딩하기 전에 우리에게 친숙한 말로 기능을 먼저 구현하는 것을 의사 코드(pseudo code)라고 합니다.

```javascript
class Particle{
  constructor(x, y) {
    this.위치 = 초기 위치;
    this.속도 = 랜덤한 방향과 속도(속도 크기는 0.5~2)
    this.객체생존시간 = 객체가 유지되는 정도;
  }
  applyForce() { 중력 작용 }
  finished() { 객체 생존시간이 지나면 true를 반환 }
  edges() { 객체가 바닥에 튕기게 설정 }
  update() { 객체의 가속도, 속도, 위치 갱신 }
  show() { 객체 그리기 }
}

function setup() { 캔버스 크기 설정 }

function draw() {
  Particle 클래스로 객체를 생성하여 particles 배열에 저장
  객체에 중력을 적용하고 바닥을 설정하고, 위치를 갱신하고, 캔버스에 그림
  객체 생존시간이 지난 객체는 particles 배열에서 제거
}  
```

이렇게 전체적인 프로그래밍 구상이 끝나면 해당하는 기능을 구현하기 위해 레퍼런스를 찾아가면서 해당 명령어를 찾아 적용시키기만 하면 됩니다. 활동 1을 구현하기 위해서 새롭게 나온 함수는 다음과 같습니다.

```javascript
// 임의의 각도에서 새로운 2D 단위 벡터를 생성합니다.
p5.Vector.random2D();
// x=50, y=20 인자를 Particle 클래스에 넘기면서 
// 새로운 객체를 형성하여 배열에 순서대로 저장함.
배열.push(new Particle(50,20));
// 객체를 배열에서 제거
// splice(항목 위치, 삭제할 항목 수)
배열.splice(i, 1);
```

> ### 활동 1. 분수 만들기 

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500" data-p5-version="1.2.0">
let particles = [];

class Particle{
  constructor(x, y) {
    this.pos = createVector(x, y);
    // 객체의 처음 속도의 방향을 랜덤하게 설정
    this.vel = p5.Vector.random2D();
    // 객체의 처음 속도의 크기를 랜덤하게 설정 (0.5~2)
    this.vel.mult(random(0.5, 2));
    this.mass = 1;
    this.acc = createVector(0, 0);
    this.r = 2;
    this.lifetime = 255;
  }
  
  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }
  
  finished() {
    // 객체 생존 시간이 0보다 작으면 true 를 반환
    return this.lifetime < 0;
  }
  
  edges() {
    if (this.pos.y >= height - this.r) {
      this.pos.y = height - this.r;
      // 바닥과 충돌하면 속도가 80%로 감소
      this.vel.y *= -0.8;
    }
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    
    this.lifetime -= 5;
  }
  
  show() {
    // stroke() 함수는 그리는 선의 색을 나타냄
    stroke(0,100,255, this.lifetime);
    // strokeWeight() 함수는 그리는 선의 두께를 나타냄
    strokeWeight(2);
    // fill()은 채우는 색을 나타내고 시간이 지날수록 객체의 색이 투명해지도록 설정
    fill(0,200,255, this.lifetime);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}

function setup() {
  createCanvas(100, 100);
}

function draw() {
  background(220);
  
  // 한 프레임당 생성되는 객체의 갯수를 3개로 설정
  // i < 3 에서 숫자를 증가시키면 생성되는 객체가 많아짐 
  for (let i = 0; i < 3; i++) {
    particles.push(new Particle(50, 20));
  }

  for (let particle of particles) {
    let gravity = createVector(0, 0.2);
    particle.applyForce(gravity);
    particle.edges();
    particle.update();
    particle.show();
  }
  
  // 배열의 마지막부터 객체 생존시간이 남아있는지 체크
  // 객첵 생존 시간이 0보다 작으면 배열에서 해당 객체 제거
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].finished()) {
      particles.splice(i, 1);
    }
  }
}
</script>

코드를 실행해 보면 객체가 한 점에서 랜덤한 속도로 생성되어 분수에서 물이 나오는 것처럼 보여지는  것을 확인할 수 있습니다. 활동 1 코드에서 생성되는 객체의 갯수나 생존시간을 조절해보면서 제일 그럴듯한 분수의 모양을 만들어 보세요.

활동 1코드를 약간 수정하면 불꽃이 타오르는 효과도 낼 수 있답니다. 어디를 수정해야 할까요?
일단 불꽃은 위로 타오르니까 중력의 영향을 없앨 필요가 있고, 대신 윗방향으로 등속운동하고 가정해 봅시다. 그럼 활동 2의 코드를 보시면서 어디를 수정했는지 살펴보시기 바랍니다. 그리고 여러분 만의 불꽃을 만들어보세요.

> ### 활동 2. 불꽃 효과 만들기 

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500" data-p5-version="1.2.0">
let particles = [];

class Particle{
  constructor(x, y) {
    this.pos = createVector(random(45, 55), y);
    // 속도를 위로 향하도록 설정
    this.vel = createVector(random(-0.5, 0.5), random(-3, -1));
    this.mass = 1;
    this.acc = createVector(0, 0);
    this.r = 3;
    this.lifetime = 255;
  }
  
  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }
  
  finished() {
    return this.lifetime < 0;
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    
    this.lifetime -= 10;
  }
  
  show() {
    // 선의 두께를 0으로 설정하고 내부만 색칠
    noStroke();
    fill(random(230,255), random(50, 100), 10, this.lifetime);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}

function setup() {
  createCanvas(100, 100);
}

function draw() {
  background(220);
  
  for (let i = 0; i < 5; i++) {
    particles.push(new Particle(50, 100));
  }

  for (let particle of particles) {
    // 불 입자는 중력이 작용하지 않고 윗방향으로 등속운동하는 것으로 구현
    let gravity = createVector(0, 0);
    particle.applyForce(gravity);
    particle.update();
    particle.show();
  }
  
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].finished()) {
      particles.splice(i, 1);
    }
  }
}
</script>

## 2. 입자계로 불꽃놀이 만들기

하늘에서 터지는 불꽃놀이도 입자계 시스템으로 표현할 수 있습니다. 앞서 분수와의 차이점은 분수는 한점에서 계속 객체를 생성하는 것이라면 불꽃놀이는 각 위치별로 수백개의 객체를 배열로 저장해서 한 번에 보여주는 것입니다. 

아래 의사 코드처럼 각 위치별로 fireworks 객체를 생성하고 그 안에서 particles객체를 생성합니다. 이중으로 클래스를 사용하는 것입니다.

```javascript
// 불꽃놀이 본체 클래스
class Firework{
  constructor(x, y) {
    this.위치 = 랜덤한 위치;
    Particle 클래스로 100개 이상의 객체를 생성하여 particles 배열에 저장
  }  
}
// 불꽃놀이 입자 클래스
class Particle{
  constructor(x, y) {
    this.위치 = 초기 위치;
    this.속도 = 랜덤한 방향과 속도
    this.객체생존시간 = 객체가 유지되는 정도;
  }
  applyForce() { 중력 작용 }
  done() { 객체 생존시간이 지나면 true를 반환 }
  update() { 객체의 가속도, 속도, 위치 갱신 }
  show() { 객체 그리기 }
}

function setup() { 캔버스 크기 설정 }

function draw() {
  Firework 클래스로 fireworks 객체 생성 (일정한 확률로 생성하게 함)
  particles 객체가 모두 사라지면 fireworks 객체도 제거
}  
```
그럼 활동 3을 통해 직접 코딩으로 구현해 보겠습니다. 활동 1보다 약간 구조가 복잡해졌지만 천천히 따라가면서 실행해보면 이해가 될 것입니다. 코드에서 불꽃놀이 입자의 갯수라던지, 발생 확률, 불꽃놀이 입자의 속도의 범위를 한번 바꿔서 실행해 보세요. 

> ### 활동 3. 불꽃놀이 만들기 

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500" data-p5-version="1.2.0">
let fireworks = [];
let gravity;

// 불꽃놀이 본체 클래스
class Firework {
  constructor() {
    this.particles = [];
    this.firework = new Particle(random(width), random(height/4, height/2));
    // 불꽃놀이 입자를 100개 만듬   
    for (let i = 0; i < 100; i++) {
      const p = new Particle(this.firework.pos.x, this.firework.pos.y);
      this.particles.push(p);
    }
  }

  done() {
    // particles 배열에서 객체가 모두 제거되어 크기가 0이 되면
    if (this.particles.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(gravity);
      this.particles[i].update();
      // 입자의 생존시간이 지나면 불꽃놀이 입자를 배열에서 제거 
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }

  show() {
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
  }
}

// 불꽃놀이 입자 클래스
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.acc = createVector(0, 0);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(0, 1));
    this.lifetime = 255;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);    
    this.lifetime -= 4;
  }

  done() {
    // 객체 생존 시간이 0보다 작으면 true 를 반환
    return this.lifetime < 0;
  }

  show() {
    strokeWeight(2);
    stroke(255, 255, 0, this.lifetime);
    // 입자를 점으로 그림
    point(this.pos.x, this.pos.y);
  }
}

function setup() {
  createCanvas(100, 100);
  gravity = createVector(0, 0.05);
}

function draw() {
  background(0,100);  
  // 숫자가 랜덤하게 0~1사이 숫자가 발생할 때 0.1보다 작을때만 불꽃놀이 객체 생성
  // 0.1 숫자보다 크게 하면 불꽃놀이 발생 확률이 높아짐
  if (random(1) < 0.1) {
    fireworks.push(new Firework());
  }
  
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    
    // 불꽃놀이 입자가 모두 사라지면 불꽃놀이 본체를 제거
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }
}
</script>


> 활동 3의 코드를 수정하여 좀 더 불꽃놀이와 유사하게 만들어 봅시다. 
> [참고 예제](https://editor.p5js.org/physics-mulberry/sketches/ZozMwGZo0){:target="_blank"}