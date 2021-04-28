---
title: "입자계 물리"
permalink: /particles/
last_modified_at: 2021-04-28
toc: true
toc_sticky: true
---

## 1. 입자계 시스템

유명한 물리학자 리처드 파인만은 모든 지식이 파괴된 인류에게 단 한 문장만 전할 수 있다면 무엇을 전하겠냐는 질문에 이렇게 답했다고 한다.

> 모든 물질은 원자로 이루어져 있다.

이 말이 중요한 이유는 원자의 관점에서 세상을 보지 않으면 제대로 물질 세계를 이해할 수 없다는 뜻이기도 합니다. 과학의 시작은 원자론에서부터 시작되었다고 해도 과언이 아닙니다. 모든 물질은 원자로 이루어져 있고 모든 물체의 운동도 각 입자의 운동의 합으로 설명할 수 있습니다.

그러나 우리가 물리학 시간에 물체의 운동도 분석할 때 쉽게 접근하기 위해 물체를 하나의 입자로 가정하고 설명해 왔습니다. 그러나 모든 물체는 부피를 가지고 수많은 원자로 구성되어 있어 실제 자연현상을 컴퓨터로 시뮬레이션 하기 위해서는 여러 입자의 운동을 입자계 시스템으로 표현할 필요가 있습니다. 

특히 불, 물, 연기와 같은 유체의 운동을 표현하기 위해서은 한 두개의 입자가 아닌 입자계 시스템을 사용합니다.

!["파티클 효과"](/assets/images/particle_effect.jpg){: .align-center}




```javascript
  mass = 1;   // 질량 초기값 설정
  r = 5;      // 공의 반지름
  //acc = createVector(0.01, 0.01);  // 가속도 대신 F=ma 관계식으로 대입
  force = createVector(0, 0.1 * mass); // 힘 벡터 초기값 설정
  acc = force.div(mass);  // 힘을 질량으로 나누어 가속도를 구함
```
모든 물체의 운동은 힘에 의해 발생하고 그 물체는 뉴턴의 운동법칙에 따라 운동하게 됩니다. 그럼 우리가 물리학 수업시간에 배운 여러 힘들을 코딩으로 구현해 보도록 하겠습니다.

## 2. 중력

지표면에서의 중력은 F=mg로 일정한 중력가속도의 값으로 지표면 방향으로만 작용합니다. 그래서 힘 벡터의 x방향 성분은 0, y방향 성분을 0.1 * mass 정도로 설정합니다. 실제 중력가속도는 9.8 m/s^2 이지만 캔버스의 크기와 실제 현실의 크기 차이가 있기 때문에 적당한 값으로 설정하였습니다. 그리고 언뜻 보기에는 좀 이상하게 보이지만 우리가 배운 물리 법칙을 구현하기 위해서 힘을 정의할 때 중력 가속도에 질량을 곱하고 다시 가속도를 구할때는 질량으로 나누는 것을 코드로 표현하였습니다. 이 때 중력 가속도는 물체의 질량과 상관없이 일정하다는 것을 기억해 보면 좋을 것 같습니다. 

지난 차시의 활동 2의 코드를 약간 수정해 봅시다. 코드를 실행해보면 공이 낙하하여 바닥에 튕기는 모습을 볼 수 있습니다.

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
  
  // 바닥에 충돌하면 속도 방향을 반대로 바꿔줌
  if (pos.y >= height) {
    vel.y = vel.y * (-1);
  }
  
  // 공의 모양, 색깔, 위치 지정
  // 공의 위치는 매번 속도 값이 반영되어 변함
  fill('yellow')
  ellipse(pos.x, pos.y, r*2, r*2);
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