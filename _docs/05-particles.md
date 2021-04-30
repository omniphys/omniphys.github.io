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

> ### 활동 1. 입자계로 분수 만들기 

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

## 2. 불꽃놀이 만들기

하늘에서 터지는 불꽃놀이는 

> ### 활동 2. 입자계로 불꽃놀이 만들기 

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500" data-p5-version="1.2.0">
let fireworks = [];
let gravity;

function setup() {
  createCanvas(100, 100);
  gravity = createVector(0, 0.2);

}

function draw() {
  colorMode(RGB);
  background(0, 0, 0, 25);
  
  if (random(1) < 0.01) {
    fireworks.push(new Firework());
  }
  
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }
}

class Firework {
  constructor() {
    this.hu = random(255);
    this.firework = new Particle(random(width), height, this.hu, true);
    this.exploded = false;
    this.particles = [];
  }

  done() {
    if (this.exploded && this.particles.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce(gravity);
      this.firework.update();

      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(gravity);
      this.particles[i].update();

      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }

  explode() {
    for (let i = 0; i < 100; i++) {
      const p = new Particle(this.firework.pos.x, this.firework.pos.y, this.hu, false);
      this.particles.push(p);
    }
  }

  show() {
    if (!this.exploded) {
      this.firework.show();
    }

    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
  }
}

class Particle {
  constructor(x, y, hu, firework) {
    this.pos = createVector(x, y);
    this.firework = firework;
    this.lifespan = 255;
    this.hu = hu;
    this.acc = createVector(0, 0);
    if (this.firework) {
      this.vel = createVector(0, random(-6, -4));
    } else {
      this.vel = p5.Vector.random2D();
      this.vel.mult(random(2, 10));
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    if (!this.firework) {
      this.vel.mult(0.9);
      this.lifespan -= 4;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  done() {
    if (this.lifespan < 0) {
      return true;
    } else {
      return false;
    }
  }

  show() {
    colorMode(HSB);

    if (!this.firework) {
      strokeWeight(2);
      stroke(this.hu, 255, 255, this.lifespan);
    } else {
      strokeWeight(4);
      stroke(this.hu, 255, 255);
    }

    point(this.pos.x, this.pos.y);
  }
}
</script>


> 그럼 활동 4의 코드를 수정하여 간단한 마찰력을 구현해 봅시다. 