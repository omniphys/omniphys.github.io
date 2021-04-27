---
title: "만유인력"
permalink: /gravity/
last_modified_at: 2021-04-26
toc: true
toc_sticky: true
---

## 1. 만유인력의 구현
만유인력 또는 중력이라고 불리는 힘은 우주의 기본 힘(상호작용)입니다. 보통 중력이라고 하면 일방적으로 당겨지는 힘으로만 생각하기 쉬워서 작용-반작용의 개념을 더 추가한 만유인력으로 부르기도 합니다. 

뉴턴의 사과 이야기 처럼 중력은 지구가 사과를 일방적으로 당기는 힘만 존재하는 것이 아니라 지구가 사과를 잡아당기는 만큼 사과가 지구를 같은 크기의 힘으로 잡아당기는 상호작용으로 중력을 이해해야 합니다. 그래서 뉴턴은 중력을 다음과 같이 정리하였습니다.

!["뉴턴의 중력법칙"](/assets/images/gravity.png){: .align-center}
> 질량 m<sub>1</sub>은 질량 m<sub>2</sub>를 두 질량의 곱과 두 질량 사이의 거리의 제곱에 반비례하는 힘으로 서로 끌어 당긴다. 두 힘 F<sub>1</sub>과 F<sub>2</sub>의 크기는 같고 방향은 반대이다. G는 중력상수이다.

그럼 중력을 코딩으로 구현해봅시다.  아래 코드를 실행시켜보고 지구와 태양의 위치나 처음 속도를 변경해보세요.

> ### 활동 1. 중력(만유인력)의 구현

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500" data-p5-version="1.2.0">
let pos1;  // 지구 위치 벡터 변수
let vel1;  // 지구 속도 벡터 변수
let acc1;  // 지구 가속도 벡터 변수
let force1;  // 지구 중력 벡터 변수
let mass1;   // 지구의 질량
let r1;      // 지구의 반지름

let pos2;  // 태양 위치 벡터 변수
let vel2;  // 태양 속도 벡터 변수
let acc2;  // 태양 가속도 벡터 변수
let force2;  // 태양 중력 벡터 변수
let mass2;   // 태양의 질량
let r2;      // 태양의 반지름

let G;  // 만유인력상수
let strength;  // 중력의 크기
let distance;  // 태양-지구사이의 거리

function setup() {
  createCanvas(100, 100);
  mass1 = 1;    // 지구 질량 초기값 설정
  mass2 = 100;  // 태양 질량 초기값 설정
  r1 = 5;      // 지구 반지름
  r2 = 10;     // 태양 반지름
  G = 5;       // 만유인력 상수 
  
  pos1 = createVector(50, 10);   // 지구 위치 벡터 초기값 설정
  vel1 = createVector(1, 0);     // 지구 속도 벡터 초기값 설정
  pos2 = createVector(50, 50);   // 태양 위치 벡터 초기값 설정
  vel2 = createVector(0, 0);     // 태양 속도 벡터 초기값 설정  
}

function draw() {
  background(220);
  
  force1 = p5.Vector.sub(pos2, pos1); // 태양이 지구를 당기는 힘의 방향 벡터
  force2 = p5.Vector.sub(pos1, pos2); // 지구가 태양을 당기는 힘의 방향 벡터
  // 거리크기제한 (너무 가까우면 힘의 크기가 무한대가 되므로)
  distance = constrain(force1.mag(), 50, 1000); 
  // 아래 코드의 주석을 풀고 실행해보면 거리가 가까워질 때 중력이 너무 커져 버리는 문제가 발생함 
  //distance = force1.mag(); 

  strength = G * (mass1 * mass2) / (distance * distance); //만유인력 공식
  force1.setMag(strength);  //힘의 크기와 방향을 같이 적용
  force2.setMag(strength);  //힘의 크기와 방향을 같이 적용

  acc1 = force1.div(mass1);
  acc2 = force2.div(mass2);

  vel1.add(acc1); // 속도 벡터에 가속도 만큼 벡터합
  pos1.add(vel1); // 위치 벡터에 속도 만큼 백터합
  
  vel2.add(acc2); // 속도 벡터에 가속도 만큼 벡터합
  pos2.add(vel2); // 위치 벡터에 속도 만큼 백터합
  
  // 지구 그리기
  fill('blue')
  ellipse(pos1.x, pos1.y, r1*2, r1*2);
  
  // 태양 그리기
  fill('red')
  ellipse(pos2.x, pos2.y, r2*2, r2*2);
}
</script>

코드를 실행해 보면 중력에 의해 태양 주변에 행성이 도는 것 같은 결과가 잘 나타나지요?
그런데 코드를 잘 살펴보면 좀 특이한 부분이 있습니다.

```javascript
force1 = p5.Vector.sub(pos2, pos1); // 태양이 지구를 당기는 힘의 방향 벡터
force2 = p5.Vector.sub(pos1, pos2); // 지구가 태양을 당기는 힘의 방향 벡터
  
// 거리크기제한 50~100000(너무 가까우면 힘의 크기가 무한대가 되므로)
distance = constrain(force1.mag(), 50, 1000);
// 아래 코드의 주석을 풀고 실행해보면 거리가 가까워질 때 중력이 너무 커져 버리는 문제가 발생함 
//distance = force1.mag(); //

strength = G * (mass1 * mass2) / (distance * distance); //만유인력 공식
force1.setMag(strength);  //힘의 크기와 방향을 같이 적용
force2.setMag(strength);  //힘의 크기와 방향을 같이 적용
```

!["두 물체 사이의 중력"](/assets/images/gravitation_between_two.png){: .align-center width="313" height="240"}

처음 force1, force2를 정할 때는 벡터의 차를 이용해 힘의 방향만 정합니다.
그리고 force1, force2는 처음에 지구와 태양의 위치 차이를 나타내는 벡터이기 때문에 mag() 함수를 이용해 벡터의 크기를 구하면 둘 사이의 거리가 구해지게 됩니다.

그런데 중력의 공식 특성상 거리의 제곱에 반비례하는 특징을 갖고 있습니다. 바꿔어 말하면 거리가 가까워질수록 중력의 크기는 커지게 됩니다.
만약 거리의 가까워져서 0이 된다면 중력의 크기는 무한대가 됩니다. 컴퓨터는 무한대는 처리할 수 없는 한계를 갖고 있습니다.

그래서 constrain()이라는 함수를 사용해서 거리의 한계값을 정해둡니다. 위 코드에서는 거리를 50보다 작으면 50으로 고정한다는 말이고 1000보다 크면 1000까지만 증가시킨다는 말입니다. 만약에 거리에 제한을 걸지 않고 실향하면 행성의 가속도가 너무 커져 튕겨나가는 모습을 볼 수 있습니다.

그리고 마지막 부분에 뉴턴의 중력 공식을 이용해 크기를 구하고 그 크기를 setMag() 함수를 이용해 힘의 벡터 크기로 설정합니다.
이러한 벡터와 관련된 함수들은 다음 레퍼런스에서 사용법을 한번 더 확인할 수 있습니다.

[p5.js vector 관련 함수](https://p5js.org/ko/reference/#/p5.Vector)

## 2. 클래스로 중력 구현하기

활동 1의 코드를 살펴보다 보면 약간 지저분하다는 느낌이 드실 것입니다. 비슷한 변수와 함수들이 반복되는 것을 볼 수 있습니다. 만약에 태양을 도는 행성이 1개가 아니라 여러개라면 반복되는 코드가 더 많아지고 코드는 더 지저분해 보일 것입니다.

그래서 프로그래밍에서는 이렇게 반복되는 부분을 클래스(class)라는 틀을 만들어서 필요할 때마다 객체(object)로 찍어내는 기법을 활용합니다. 이러한 프로그래밍 방식을 객체지향 프로그래밍이라고 합니다. 예를 들어 자동차라는 클래스를 만들어 놓으면 다양한 종류의 자동차를 쉽게 만들어 낼 수 있습니다. 

!["객체지향프로그래밍"](/assets/images/oop.png){: .align-center}

그럼 활동 1의 코드를 클래스로 다시 구현해 보도록 하겠습니다.

> ### 활동 2. 클래스 만들기

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500" data-p5-version="1.2.0">
class Planet{
  constructor(x, y, vx, vy, m, r, c) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.acc = createVector(0, 0);
    this.mass = m;
    this.r = r;
    this.G = 5;
    this.color = c;
  }
  
  attract(other) {
    let force = p5.Vector.sub(other.pos, this.pos);
    let distance = force.mag();
    distance = constrain(distance, 50, 1000);
    let strength = (this.G * this.mass * other.mass) / (distance * distance);
    force.setMag(strength);
    this.applyForce(force);
  }
  
  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }
  
  show() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}

function setup() {
  createCanvas(100, 100);
  
  sun = new Planet(50, 50, 0, 0, 100, 10, 'red');
  earth = new Planet(50, 10, 1, 0, 1, 5, 'blue');
}

function draw() {
  background(220);
  
  sun.attract(earth);
  earth.attract(sun);
  
  sun.update();
  earth.update();
  
  sun.show();
  earth.show();
}
</script>


코드를 실행해보면 공과 바닥면의 충돌이 약간 불안한 것을 알 수 있습니다. 그 이유는 공의 크기가 0이 아니고, draw()함수의 반복주기가 1초에 60번 정도이기 때문에 공의 속도가 빠른 경우 정해둔 벽의 경계조건을 넘어가기도 합니다. 그래서 현실에서처럼 충돌을 정확하게 처리하는 것이 쉽지 않습니다. 그래서 바닥과의 충돌시 위치를 다음 코드와 같이 재조정할 필요가 있습니다.


```javascript
  // 공의 반지름을 고려하여 바닥의 위치를 정하고
  // 바닥 경계를 넘어가면 공의 위치를 바닥위치로 재설정
  if (pos.y >= height - r) {
      pos.y = height - r;
      vel.y *= -1;
    }
```

> ### 활동 2. 중력의 구현 (공의 충돌 경계 수정) 

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500">
let pos;  // 위치 벡터 변수
let vel;  // 속도 벡터 변수
let acc;  // 가속도 벡터 변수
let force;  // 힘 벡터 변수
let mass;   // 공의 질량
let r;      // 공의 반지름

function setup() {
  createCanvas(100, 100);
  mass = 1;   // 질량 초기값 설정
  r = 5;      // 공의 반지름
  pos = createVector(50, 10);   // 위치 벡터 초기값 설정
  vel = createVector(0, 0);     // 속도 벡터 초기값 설정
  //acc = createVector(0.01, 0.01);  // 가속도 대신 질량과-힘 관계식으로 대입
  force = createVector(0, 0.1 * mass); // 힘 벡터 초기값 설정
  acc = force.div(mass);
}

function draw() {
  background(220);
  
  vel.add(acc); // 속도 벡터에 가속도 만큼 벡터합
  pos.add(vel); // 위치 벡터에 속도 만큼 백터합
  
  // 벽에 충돌하면 속도 방향을 반대로 바꿔줌
  if (pos.y >= height - r) {
      pos.y = height - r;
      vel.y *= -1;
    }
  
  // 공의 모양, 색깔, 위치 지정
  // 공의 위치는 매번 속도 값이 반영되어 변함
  fill('yellow')
  ellipse(pos.x, pos.y, r*2, r*2);
}
</script>

활동 2의 코드를 실행해보면 바닥과 잘 충돌하여 튕기는 모습을 확인할 수 있습니다. 그런데 시간이 지나다보면 공의 위치가 점점 낮아지고 에너지가 보존되지 않는 모습을 보게 됩니다. 

왜 그럴까요?

이것은 우리가 사용한 오일러 방법의 오차가 존재하기 때문입니다. 역학적 에너지가 보존되게 구현하려면 좀 더 오차가 작은 방법이 필요합니다.

```javascript
  // 오일러 방법
  vel.add(acc); // 속도 벡터에 가속도 만큼 벡터합
  pos.add(vel); // 위치 벡터에 속도 만큼 백터합
```

그래서 등가속도 운동에 좀 더 적합한 방법으로 수정해 보겠습니다. 속도를 넣을 때 이전 속도와 현재 속도의 평균값으로 넣으면 오차를 줄일 수 있습니다. 특히 속도가 일정하게 증가하는 등가속도 운동에서는 아주 정확한 결과를 보여줍니다. 이를 수정된 오일러 방법이라고 합니다.

```javascript
  // 수정된 오일러 방법
  prev = vel.copy();  // 이전 속도 저장
  vel.add(acc);       // 현재 속도 가속도 반영
  avgv = prev.add(vel); // 이전 속도 벡터 + 현재 속도 벡터합
  pos.add(avgv.mult(0.5));  //평균 속도 벡터 적용
```
대신 이 평균 속도를 사용할 경우 바닥에 충돌했을 때 위치 재조정 부분은 제거해줘야 합니다. 왜냐하면 충돌시 인위적으로 위치를 재조정한 것이기 때문에 역학적 에너지가 증가하는 현상이 발생할 수 있기 때문입니다.

```javascript
  // 공이 바닥에 충돌하면 위치를 조정하는 부분 삭제
  // 삭제하지 않으면 오히려 역학적 에너지가 증가함
  if (pos.y >= height - r) {
      // pos.y = height - r; 
      vel.y *= -1;
    }
```

그럼 활동 3에서 역학적 에너지가 보존되도록 만들어 봅시다.

> ### 활동 3. 중력의 구현 (오차를 줄이는 방법) 

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500">
let pos;  // 위치 벡터 변수
let vel;  // 속도 벡터 변수
let acc;  // 가속도 벡터 변수
let force;  // 힘 벡터 변수
let mass;   // 공의 질량
let r;      // 공의 반지름
let prev; // 이전 속도 변수
let avgv; // 평균 속도 변수

function setup() {
  createCanvas(100, 100);
  mass = 1;   // 질량 초기값 설정
  r = 5;      // 공의 반지름
  pos = createVector(50, 10);   // 위치 벡터 초기값 설정
  vel = createVector(0, 0);     // 속도 벡터 초기값 설정
  //acc = createVector(0.01, 0.01);  // 가속도 대신 질량과-힘 관계식으로 대입
  force = createVector(0, 0.1 * mass); // 힘 벡터 초기값 설정
  acc = force.div(mass);
}

function draw() {
  background(220);
  
  prev = vel.copy();
  vel.add(acc);
  avgv = prev.add(vel)
  pos.add(avgv.mult(0.5)); 
  
  // 벽에 충돌하면 속도 방향을 반대로 바꿔줌
  if (pos.y >= height - r) {
      //pos.y = height - r;
      vel.y *= -1;
    }
  
  // 공의 모양, 색깔, 위치 지정
  // 공의 위치는 매번 속도 값이 반영되어 변함
  fill('yellow')
  ellipse(pos.x, pos.y, r*2, r*2);
}
</script>

코드를 실행해보면 어떤 결과가 나오나요?

시간이 지난후에도 공이 바닥에 충돌한 후 원래 높이로 돌아오는 것을 확인할 수 있습니다. 그러나 이 '수정된 오일러 방법'도 오차를 가지고 있어 더 정확한 계산을 필요로하는 시뮬레이션에서는 또 다른 계산 방법을 사용하기도 합니다. 그러나 이 오차를 줄이려면 더 많은 컴퓨터 성능이 필요하고 처리에 시간이 더 걸릴 수 있습니다. 그래서 우리는 앞으로 약간의 오차는 있지만 오일러 방법으로 운동을 계속 구현해 보도록 하겠습니다.

## 3. 알짜힘 (합력)
이번에는 여러 힘이 동시에 작용하는 경우를 살펴보도록 하겠습니다. 물체에 여러 힘이 작용하면 우리는 그 힘들을 벡터합을 할 수 있고, 이렇게 합한 힘을 알짜힘 또는 합력이라고 합니다. 

vector.add()함수를 이용하면 다음 코드와 같이 알짜힘을 쉽게 구현할 수 있습니다.

```javascript
function draw() {
  // 중력을 정의
  gravity = createVector(0, 0.1 * mass); // 힘 벡터 초기값 설정
  acc = gravity.div(mass);
  // 마우스를 누를때만 오른쪽 방향으로 바람힘을 가함
  if (mouseIsPressed) {
    wind = createVector(0.1, 0); 
    acc.add(wind);  // 가속도 벡터합 (알짜힘 적용)
  }
  ...

  // 왼쪽, 오른쪽 경계벽에 충돌하면 속도 방향을 반대로 바꿔줌
  if (pos.x >= width - r) {
      vel.x *= -1;
    } else if (pos.x <= r) {
      vel.x *= -1;
    }

  ...
  // 가속도 초기화 (초기화를 해주지 않으면 점점 가속됨)
  acc.set(0, 0);
}
```

그런데 바람은 중력과 달리 항상 부는 것이 아니기 때문에 마우스를 클릭할 때만 오른쪽으로 바람이 불도록 하려면 mouseIsPressed 이벤트를 활용합니다. 

mouseIsPressed 이벤트는 마우스가 눌렸을 경우에만 참값을 반환하므로 if 조건문안에 넣으면 마우스를 눌렀을 때만 작동하는 코드를 만들 수 있습니다.

그리고 활동 3가 다르게 바람에 의해 좌우로 움직이기 때문에 좌우에 벽 조건을 설정해 좌우 경계를 넘어가면 속도 방향을 반대로 바꿔주어 충돌 효과를 추가합니다.

또한 draw() 함수 마지막에 가속도를 초기화하는 부분을 넣어줄 필요가 있습니다. 바람처럼 항상 작용하지 않는 힘이 있기 때문에 draw()함수가 반복할때마다 가속도를 0으로 초기화해주고 힘과 가속도를 설정해주어야 합니다. 

그럼 바람의 힘을 활동 3의 코드에 추가해보도록 하겠습니다.

> ### 활동 4. 바람과 중력의 구현 

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500">
let pos;  // 위치 벡터 변수
let vel;  // 속도 벡터 변수
let acc;  // 가속도 벡터 변수
let mass;   // 공의 질량
let r;      // 공의 반지름
let prev; // 이전 속도 변수
let avgv; // 평균 속도 변수
let gravity;  // 중력 벡터 변수
let wind;     // 바람 벡터 변수

function setup() {
  createCanvas(100, 100);
  mass = 1;   // 질량 초기값 설정
  r = 5;      // 공의 반지름
  pos = createVector(50, 10);   // 위치 벡터 초기값 설정
  vel = createVector(0, 0);     // 속도 벡터 초기값 설정
}

function draw() {
  background(220);
  
  // 중력을 가함
  gravity = createVector(0, 0.1 * mass); // 힘 벡터 초기값 설정
  acc = gravity.div(mass);
  
  // 마우스를 누를때만 오른쪽 방향으로 바람힘을 가함
  if (mouseIsPressed) {
    wind = createVector(0.1, 0); 
    acc.add(wind);
  }
  
  prev = vel.copy();
  vel.add(acc);
  avgv = prev.add(vel)
  pos.add(avgv.mult(0.5)); 
  
  
  // 바닥에 충돌하면 속도 방향을 반대로 바꿔줌
  if (pos.y >= height - r) {
      vel.y *= -1;
    }
  
  // 왼쪽, 오른쪽 벽에 충돌하면 속도 방향을 반대로 바꿔줌
  if (pos.x >= width - r) {
      vel.x *= -1;
    } else if (pos.x <= r) {
      vel.x *= -1;
    }
  
  // 공의 모양, 색깔, 위치 지정
  // 공의 위치는 매번 속도 값이 반영되어 변함
  fill('yellow')
  ellipse(pos.x, pos.y, r*2, r*2);
  
  // 가속도 초기화 (초기화를 해주지 않으면 점점 가속됨)
  acc.set(0, 0);  
}
</script>

마우스를 눌렀을 때만 공이 바람에 날리는 것처럼 오른쪽으로 힘을 받는 것을 관찰하셨나요? 

그런데 막상 시뮬레이션을 보고 있으면 약간 부자연스러움이 느껴지실 것입니다. 왜냐하면 현실에서는 마찰력이나 공기저항 때문에 역학적 에너지가 잘 보존되지 않기 때문입니다. 현실에서라면 공의 운동에서 마찰에 의해 에너지가 열에너지나 소리에너지로 전환되고 공은 점점 속도가 줄어들어 멈추게 됩니다. 

그럼 마찰력도 한번 구현해볼까요?

앞선 활동 4처럼 마찰력을 추가하여 가속도를 벡터합하면 됩니다. 그런데 여기서는 보다 간단한 방법으로 마찰력을 구현할 수 있습니다. 마찰력은 벽이나 바닥에 부딪힐 때에만 작용하기 때문에 벽에 부딪힐 때에만 속도를 비율로 줄여도 마찰력과 비슷한 효과가 나타납니다. 
충돌할 때 속도 방향을 -1을 곱해서 바꿔줄 때 다음 코드처럼 -0.8을 곱하면 속력이 충돌할 때마다 20%씩 감소하게 됩니다. 

```javascript
// 바닥에 충돌하면 속도 방향을 반대로 바꿔줌(속력을 20%씩 감소)
  if (pos.y >= height - r) {
      vel.y *= -0.8;  
    }
  
  // 왼쪽, 오른쪽 벽에 충돌하면 속도 방향을 반대로 바꿔줌(속력을 20%씩 감소)
  if (pos.x >= width - r) {
      vel.x *= -0.8;  
    } else if (pos.x <= r) {
      vel.x *= -0.8;
    }
```

> 그럼 활동 4의 코드를 수정하여 간단한 마찰력을 구현해 봅시다. 