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

자바스크립트로 구현된 클래스의 예를 들어보겠습니다.

```javascript
class Car {
  // 생성자(constructor)는 클래스에서 객체가 생성될 때 처음 실행된다.
  // (name)은 객체가 생성될 때 넘겨받는 인수값이다.
  // this.변수명 은 객체에서 사용되는 멤버 변수이다.
  constructor(name) {
    this.name = name;
  }
  // 클래스 내의 기능을 구현하는 함수(또는 메서드) 정의
  showBrand() {
    alert(this.name);
  }
}
// Car 클래스에서 "Audi"이라는 값을 넘기면서 car1 라는 객체 생성
// 생성된 car객체의 showBrand() 함수 호출
let car1 = new Car("Audi");
let car2 = new Car("Volvo");

car1.showBrand();
car2.showBrand();
```
new Car(차이름)를 호출하면 다음과 같은 일이 일어납니다.

1. Car라는 클래스를 틀로 삼아 car1, car2 라는 새로운 객체가 생성됩니다.
2. 넘겨받은 인수와 함께 constructor가 자동으로 실행됩니다. 이때 인수 "Audi","Volvo"가 각 객체의 this.name에 할당됩니다.
3. 이런 과정을 거친 후에 showBrand() 같은 객체 함수를 호출할 수 있습니다.

이러한 식으로 클래스를 구현하면 코드의 재사용성과 프로그램의 구조적 체계성을 높일 수 있습니다.

그럼 활동 1의 코드를 클래스로 다시 구현해 보도록 하겠습니다.

> ### 활동 2. 클래스로 중력 구현하기

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500" data-p5-version="1.2.0">
class Planet{
  // 생성자 인수로 (위치x, 위치y, 속도x, 속도y, 질량, 반지름, 색깔)로 설정
  constructor(x, y, vx, vy, m, r, c) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.acc = createVector(0, 0);
    this.mass = m;
    this.r = r;
    this.color = c;
    this.G = 5;
  }

  // attract() 험수는 다른 객체의 정보를 받아 현 객체와 다른 객체 사이의 만유인력의 크기와 방향을 계산한다.
  attract(other) {
    let force = p5.Vector.sub(other.pos, this.pos);
    let distance = force.mag();
    distance = constrain(distance, 50, 1000);
    let strength = (this.G * this.mass * other.mass) / (distance * distance);
    force.setMag(strength);
    this.applyForce(force);
  }
  
  // applyForce() 함수는 force 벡터를 전달받아 F=ma 공식에 의해 힘을 질량으로 나누고 객체에 가속도를 추가한다.
  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }
  
  // update() 함수는 오일러 방법으로 가속도->속도->위치를 업데이트 한다. 적용한 후에 가속도를 초기화한다. 
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  // show() 함수는 캔버스에 행성을 그린다.
  show() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}

function setup() {
  createCanvas(100, 100);
  // 태양 객체와 지구 객체를 생성. 인수 (위치x, 위치y, 속도x, 속도y, 질량, 반지름, 색깔)
  sun = new Planet(50, 50, 0, 0, 100, 10, 'red');
  earth = new Planet(50, 10, 1, 0, 1, 5, 'blue');
}

function draw() {
  background(220);
  // 만유인력 계산
  sun.attract(earth);
  earth.attract(sun);
  // 가속도, 속도, 위치 업데이트
  sun.update();
  earth.update();
  // 행성 캔버스에 그리기
  sun.show();
  earth.show();
}
</script>

코드를 실행해보면 활동 1과 같은 결과가 나타나는 것을 볼 수 있습니다. 하지만 코드를 살펴보면 클래스를 통해 한결 코드의 재사용성이 높아진 것을 확인할 수 있습니다. 

그러나 여기서 끝이 아닙니다. 객체 지향 프로그래밍의 힘은 객체가 많아질 때 나타납니다. 여러분이 직접 행성 하나를 더 추가해 볼까요? 어떻게 하면 될까요?


```javascript
// 목성 추가
jupyter = new Planet(50, 95, -2, 0, 1, 8, 'yellow');
...
// 지구와 새 행성사이의 인력은 무시
sun.attract(jupyter);
jupyter.attract(sun);
// 목성 위치 추가 및 그리기
jupyter.update();
jupyter.show();

```

코드에 보는 것과 같이 단 5줄의 코드만 추가하면 새 행성을 추가되어 운동하는 것을 볼 수 있습니다. 클래스를 사용하면 많은 객체를 다룰 때 아주 편리합니다. 직접 여러분이 행성을 추가해서 실행시켜 보시기 바랍니다.


## 3. 배열과 반복문을 이용하여 태양계 만들기
앞서 활동 2에서는 태양과의 지구, 태양과 목성 사이의 중력만 고려해서 코딩을 했지만, 실제로는 목성과 지구사이에도 중력이 작용합니다. 

만약 태양계를 만든다면 행성 객체가 많아지고 attract()로 힘을 계산하는 경우의 수가 조합의 만큼 늘어나고 또 그만큼 update(), show() 함수를 호출하는 작업을 반복해야 합니다. 

이러한 같은 작업이 반복되는 것을 좀 더 편리하게 수해하기 위해서 배열과 반복문을 다뤄보도록 하겠습니다.

배열은 주소를 가진 저장장소라고 생각하시면 됩니다. 변수명에 [0] 시작하는 주소를 붙여서 만듭니다. 

```javascript
// 행성 배열을 선언한다.
let planets = [];
...
// 각 배열의 주소는 0부터 시작히여 1씩 증가한다.
// 각 배열에 행성 클래스를 이용하여 행성 객체를 추가한다.
  planets[0] = new Planet(50, 50, 0, 0, 100, 10, 'red');
  planets[1] = new Planet(50, 10, 1, 0, 1, 3, 'blue');
  planets[2] = new Planet(30, 50, 0, -1, 2, 4, 'green');
  planets[3] = new Planet(50, 95, -2, 0, 3, 5, 'yellow');
  planets[4] = new Planet(90, 10, -2, 0, 1, 3, 'pink');

```

배열을 이용하면 숫자로된 주소로 간편하게 접근하여 프로그래밍을 보다 효과적으로 할 수 있습니다.

배열에 저장된 각 행성간의 작용하는 중력을 계산하거나 각 행성별로 함수를 실행하려면 반복문이 필요합니다. 대표적인 반복문에는 for 명령어가 있습니다.

```javascript
// 문법
for ([초기문]; [조건문]; [증감문]) {
    문장
  }
// 각 행성별로 가속도, 속도, 위치 업데이트 및 그리기
// planets.length 는 배열의 크기를 나타냅니다.
for (let i = 0; i < planets.length; i++) {
    planets[i].update();
    planets[i].show();
  }
```

이렇게 배열과 for 반복문을 사용하면 여러번 명령어를 쓰지 않고 한번에 명령을 실행시킬 수 있습니다. 이렇게 하면 나중에 코드를 수정할때도 힘이 덜 들게 됩니다.  

조금 더 복작한 내용이지만 각 행성별로 작용하는 중력을 구하기 위해서는 많은 조합으로 경우의 수만큼 반복해야 하는데요. 반복문을 쓰지 않고 그냥 일일히 코드를 적는다면 다음과 같이 많은 코드를 반복해야 합니다.

```javascript
// 반복문을 사용하지 않은 경우 (자기 자신을 끌어당기는 것은 제외)
planet[0].attract(planet[1]);
planet[0].attract(planet[2]);
planet[0].attract(planet[3]);
planet[0].attract(planet[4]);
planet[1].attract(planet[0]);
planet[1].attract(planet[2]);
planet[1].attract(planet[3]);
planet[1].attract(planet[4]);
...
planet[4].attract(planet[0]);
planet[4].attract(planet[1]);
planet[4].attract(planet[2]);
planet[4].attract(planet[3]);
```

하지만 for 반복문을 이중으로 써 주면 아주 간단하게 코드를 줄일 수 있습니다.

```javascript
// 이중 for 반복문을 사용한 경우
for (let i = 0; i < planets.length; i++) {
    for (let j = 0; j < planets.length; j++) {
      // 자기 자신을 끌어당기는 경우는 제외하기 위해서 if 조건문을 사용
      if (i != j) {
        planets[j].attract(planets[i]);
      }
    }
  }
```

자 이제 우리는 클래스, 배열, 반복문을 이용해 많은 객체를 다룰 수 있게 되었습니다. 그럼 우리만의 태양계를 한번 직접 구현해 볼까요?


> ### 활동 3. 태양계의 구현 

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500" data-p5-version="1.2.0">
// 행성 배열 선언
let planets = [];

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
  
  planets[0] = new Planet(50, 50, 0, 0, 100, 10, 'red');
  planets[1] = new Planet(50, 10, 1, 0, 1, 3, 'blue');
  planets[2] = new Planet(30, 50, 0, -1, 2, 4, 'green');
  planets[3] = new Planet(50, 95, -2, 0, 3, 5, 'yellow');
  planets[4] = new Planet(90, 10, -2, 0, 1, 3, 'pink');
  
}

function draw() {
  background(220);
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = 0; j < planets.length; j++) {
      if (i != j) {
        planets[j].attract(planets[i]);
      }
    }
    planets[i].update();
    planets[i].show();
  }
}
</script>

코드를 실행해 봅시다. 여러 행성들의 운동이 수업시간에 배운 중력의 법칙 단 하나로 설명되는 것을 알 수 있습니다. 

이처럼 물리 법칙을 잘 이해하고 있으면 자연을 프로그램으로 쉽게 구현할 수 있습니다. 그리고 게임이나 시뮬레이션에서 이러한 물리 법칙을 프로그램으로 구현한 것을 물리엔진이라고 하고 우리는 지금 간단한 물리엔진을 구현해 보는 과정을 배우고 있는 것입니다. 

> 활동 3의 코드를 수정하여 더 많은 행성들을 추가해보고 여러분만의 태양계를 만들어 보세요. 