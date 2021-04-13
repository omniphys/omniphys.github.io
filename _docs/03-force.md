---
title: "힘과 운동"
permalink: /force/
last_modified_at: 2021-04-13
toc: true
toc_sticky: true
---

## 1. 뉴턴의 운동 법칙
힘(Force)은 모든 운동과 형태 변화의 원인이 되는 것으로 아이작 뉴턴이 정립한 개념입니다. 뉴턴은 힘과 운동의 성질은 3가지 법칙으로 정립하였는데 우리가 배운 모든 고전 역학 법칙, 공식들은 뉴턴의 운동법칙에서 유도되었다고 할 수 있을 정도로 물리학의 기본이 되는 개념입니다.

> 제1법칙 : 관성의 법칙 (모든 물체는 현재의 운동 상태를 유지하려는 성질이 있다. 정지한 물체는 정지하려고 하고 운동하는 물체는 등속운동하려고 한다. 관성의 크기는 질량의 크기와 같다.)

> 제2법칙 : 운동 방정식 a = F/m (물체의 가속도는 힘에 비례하고, 질량에 반비례한다. 모든 운동에 관한 문제는 운동 방정식을 푸는 것이다.)

> 제3법칙 : 작용-반작용 법칙 (힘은 상호작용이다.) 

지난 차시의 활동 2 코드를 약간 수정해 봅시다. 가속도를 직접 대입하는 대신 힘과 질량의 관계식으로 수정해봅시다. 코드를 실행해보면 공이 낙하하여 바닥에 튕기는 모습을 볼 수 있습니다.


> ### 활동 1. 중력의 구현

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
  pos = createVector(10, 50);   // 위치 벡터 초기값 설정
  vel = createVector(0, 0);     // 속도 벡터 초기값 설정
  //acc = createVector(0.01, 0.01);  // 가속도 대신 질량과-힘 관계식으로 대입
  force = createVector(0, 0.1); // 힘 벡터 초기값 설정
  mass = 1;   // 질량 초기값 설정
  r = 5;
  acc = force.div(mass);
}

function draw() {
  background(220);
  
  vel.add(acc); // 속도 벡터에 가속도 만큼 벡터합
  pos.add(vel); // 위치 벡터에 속도 만큼 백터합
  
  // 벽에 충돌하면 속도 방향을 반대로 바꿔줌
  if ((pos.x > width) || (pos.x < 0)) {
    vel.x = vel.x * (-1);
  }
  if ((pos.y > height) || (pos.y < 0)) {
    vel.y = vel.y * (-1);
  }
  
  // 공의 모양, 색깔, 위치 지정
  // 공의 위치는 매번 속도 값이 반영되어 변함
  fill('yellow')
  ellipse(pos.x, pos.y, r*2);
}
</script>

코드를 실행해보면 공과 바닥면의 충돌이 약간 불안한 것을 알 수 있습니다. 


> ### 활동 2. 중력의 구현 (공의 충돌 경계 수정) 

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500">
let pos;  // 위치 벡터 변수
let vel;  // 속도 벡터 변수
let acc;  // 가속도 벡터 변수
function setup() {
  createCanvas(100, 100);
  pos = createVector(50, 50);   // 위치 벡터 초기값 설정
  vel = createVector(0, 0);     // 속도 벡터 초기값 설정
  acc = createVector(0.01, 0.01);  // 가속도 벡터 초기값 설정 
}

function draw() {
  background(220);
  vel.add(acc); // 속도 벡터에 가속도 만큼 벡터합
  pos.add(vel); // 위치 벡터에 속도 만큼 백터합
  // 벽에 충돌하면 반대쪽에서 다시 나타나게 함.
  if (pos.x > width) {
    pos.x = 0;
  } 
  else if (pos.x < 0) {
    pos.x = width;
  }
  if (pos.y > height) {
    pos.y = 0;
  } 
  else if (pos.y < 0) {
    pos.y = height;
  }
  // 공의 모양, 색깔, 위치 지정
  // 공의 위치는 매번 속도 값이 반영되어 변함
  fill('yellow')
  ellipse(pos.x, pos.y, 10,10);
}
</script>

여러분 어떤가요? 코드가 약간 단순화 된 것이 보이나요? 그러나 이것은 벡터의 힘을 일부분만 보여준 것입니다. 앞으로 힘에 대해서 다루게 될텐데 벡터의 장점이 더욱 잘 나타날 것이니 기대하세요.

앞의 활동 2의 코드를 살펴보면 속도와 벡터를 이용하여 공을 움직에 만들어 보았습니다. 캔버스에서 움직임을 만드는 방법은 다음과 같습니다.

>1. 위치에 속도를 더한다.
>2. 위치에 객체를 그린다.

draw()함수는 무한히 반복되는 함수이기 때문에 객체의 위치는 계속 바뀌게 되는 것입니다.

활동 2의 코드에서 속도와 위치벡터를 바꿔보고 어떻게 움직임이 변하는지 살펴보세요.

## 2. 벡터와 가속도
이번에는 공의 움직임에 가속도를 추가해보겠습니다. 수업시간에 배운 가속도의 정의가 생각나나요? 

가속도는 단위 시간동안의 속도 변화입니다. 속도도 이와 비슷한 개념으로 배운 것을 기억하실 것입니다. 

속도는 단위 시간동안의 위치 변화이지요. 이렇게 시간에 따른 변화를 수학적으로는 미분, 적분의 개념으로 다룰 수 있다는 것도 배웠을 것입니다.

!["변위-속도-가속도"](/assets/images/dis_vel_acc.png){: .align-center}

이렇게 연쇄적으로 가속도는 속도에 영향을 주고 속도는 위치에 영향을 줍니다. 가속도에서부터 변위를 구하는 과정을 코드로 나타내면 다음과 같습니다.

```javascript
vel.add(acc);   // 속도에 가속도만큼 벡터합을 해줍니다.
pos.add(vel);   // 위치에 속도만큼 벡터합을 해줍니다.
```

물론 이 방법을 '오일로 방법'이라고도 하며 실제 운동과는 다르게 오차를 가집니다. 시간을 무한히 작게 할 수 없는 부분과 컴퓨터 자체의 한계가 있기 때문에 오차를 가지며 오차는 누적되면 큰 차이를 나타내게 됩니다.

하지만 이 방법은 에너지가 잘 보존되는 특징이 있어서 우리처럼 기초적인 물리 시뮬레이션을 만들 때는 유용하게 사용할 수 있습니다. 앞으로의 힘이 작용하는 운동에서는 모두 이 방법을 사용하도록 하겠습니다.

그럼 이제 활동2의 공에 일정한 가속도를 가지도록 해보겠습니다.

> ### 활동 3. 공의 등가속운동

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="700">
let pos;  // 위치 벡터 변수
let vel;  // 속도 벡터 변수
let acc;  // 가속도 벡터 변수
function setup() {
  createCanvas(100, 100);
  pos = createVector(50, 50);   // 위치 벡터 초기값 설정
  vel = createVector(0, 0);     // 속도 벡터 초기값 설정
  acc = createVector(0.01, 0.01);  // 가속도 벡터 초기값 설정 
}

function draw() {
  background(220);
  vel.add(acc); // 속도 벡터에 가속도 만큼 벡터합
  pos.add(vel); // 위치 벡터에 속도 만큼 백터합
  // 벽에 충돌하면 반대쪽에서 다시 나타나게 함.
  if (pos.x > width) {
    pos.x = 0;
  } 
  else if (pos.x < 0) {
    pos.x = width;
  }
  if (pos.y > height) {
    pos.y = 0;
  } 
  else if (pos.y < 0) {
    pos.y = height;
  }
  // 공의 모양, 색깔, 위치 지정
  // 공의 위치는 매번 속도 값이 반영되어 변함
  fill('yellow')
  ellipse(pos.x, pos.y, 10,10);
}
</script>

실제로 실행을 시켜보면 가속도에 의해서 속도가 점점 빨라지는 것을 볼 수 있습니다. 그런데 속도는 계속 커지기 때문에 오랫동안 실행하면 속도값이 무한히 커질 위험이 있습니다. 그래서 속도에 최대값을 두어 제한을 해보겠습니다.

```javascript
vel.add(acc);   // 속도에 가속도만큼 벡터합을 해줍니다.
vel.limit(10);  // 속도의 최대치를 10으로 제한합니다.
pos.add(vel);   // 위치에 속도만큼 벡터합을 해줍니다.
```

여러분이 직접 활동3의 코드를 수정해서 다시 실행해보십시요.

그럼 이번에는 운동에 다양한 변화를 주기 위해서 랜덤함 가속도를 주어볼까요?
가속도를 랜덤하게 만들기 위해서 p5.Vector.random2D() 함수를 사용해 보도록 하겠습니다.

```javascript
acc = createVector(0, 0); // 가속도를 0으로 초기화
...
acc = p5.Vector.random2D(); // 임의의 방향으로 크기1의 벡터가 만들어짐
vel.add(acc);   // 속도에 가속도만큼 벡터합을 해줍니다.
vel.limit(10);  // 속도의 최대치를 10으로 제한합니다.
pos.add(vel);   // 위치에 속도만큼 벡터합을 해줍니다.
```

> ### 활동 4. 공의 랜덤한 가속운동

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="700">
let pos;  // 위치 벡터 변수
let vel;  // 속도 벡터 변수
let acc;  // 가속도 벡터 변수
function setup() {
  createCanvas(100, 100);
  pos = createVector(50, 50);   // 위치 벡터 초기값 설정
  vel = createVector(0, 0);     // 속도 벡터 초기값 설정
  acc = createVector(0, 0);  // 가속도 벡터 초기값 설정 
}

function draw() {
  background(220);
  acc = p5.Vector.random2D(); // 임의의 방향으로 크기1의 벡터가 만들어짐
  vel.add(acc);   // 속도에 가속도만큼 벡터합을 해줍니다.
  vel.limit(10);  // 속도의 최대치를 10으로 제한합니다.
  pos.add(vel);   // 위치에 속도만큼 벡터합을 해줍니다.
  // 벽에 충돌하면 반대쪽에서 다시 나타나게 함.
  if (pos.x > width) {
    pos.x = 0;
  } 
  else if (pos.x < 0) {
    pos.x = width;
  }
  if (pos.y > height) {
    pos.y = 0;
  } 
  else if (pos.y < 0) {
    pos.y = height;
  }
  // 공의 모양, 색깔, 위치 지정
  // 공의 위치는 매번 속도 값이 반영되어 변함
  fill('yellow')
  ellipse(pos.x, pos.y, 10,10);
}
</script>

랜덤한 가속도로 인해 보다 운동이 다양해졌다는 것을 알 수 있었죠? 그럼 실제 다양한 힘을 적용한 운동은 다음 시간에 구현해 보도록 하겠습니다. 