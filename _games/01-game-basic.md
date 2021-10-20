---
title: "공룡 게임 만들기 - 1. 점프 기능"
permalink: /games/game-basic/
excerpt: "p5.js로 게임을 만들어 봅시다"
last_modified_at: 2021-10-20
toc: true
toc_sticky: true
---

안녕하세요. 여러분. 수능 전과 후에 다시 온라인 수업에 들어가게 되었는데요.

이번 온라인 수업 기간 동안에는 물리엔진과 인공지능을 적용한 게임을 만들어 보려고 합니다.

그 첫 게임으로 크롬 브라우저에서 인터넷 연결이 안될 때 가끔 해본적이 있을 공룡 게임을 간단히 만들어 보겠습니다. 

일단 안해본 학생들은 아래 게임에서 스페이스바를 누르고 직접 해보시기 바랍니다. 게임의 기능을 익히는 것은 직접 게임을 해보는 것 만큼 좋은 것은 없으니까요! 

<iframe src="https://codepen.io/MysticReborn/embed/rygqao?default-tab=&theme-id=" width="100%" height="600"></iframe>


여러분 모두 게임을 재밌게 해보았나요? 그럼 우리가 직접 이 게임을 구현해 보도록 하겠습니다. 첫번째 기능으로 점프 기능을 구현해 봅시다.

## 1. 점프 기능 구현하기

우리가 지난 온라인 수업 기간에 배웠던 p5.js 프로그래밍을 다시 한번 기억해보면서 클래스와 setup(), draw() 함수의 구조를 떠올려 봅시다. 공룡 게임을 구현하기 위해서 아래와 같이 Dino클래스를 만들고 mousePressed()와 keyPressed()를 이용하여 마우스나 키보드 입력을 받는 프로그램의 의사 코드(pseudo code)를 작성해 볼 수 있습니다.

```javascript
class Dino{
  constructor(x, y, m, r) {
    this.위치 = 초기 위치;
    this.속도 = 초기 속도(=0,0);
    this.가속도 = 초기 가속도(=0,0);
    this.질량 = 공룡의 질량;
    this.반지름 = 공룡의 크기; // 처음에는 공룔을 간단하게 원형 물체로 구현해 봅시다.
  }
  jump() {공룡이 -y 방향으로 속도를 가지게 하여 점프기능을 구현}
  applyForce() { 중력 작용 }
  edges() { 공룡이 바닥에 위치하게 한다.}
  update() { 객체의 가속도, 속도, 위치 갱신 }
  show() { 객체 그리기 }
}

function setup() { 
    캔버스 크기 설정
    공룡 객체 생성 
}

function draw() {
  공룡 객체에 중력을 적용하고 바닥을 설정하고, 위치를 갱신하고, 캔버스에 그림
}

function mousePressed() {
    마우스를 클릭하였을 때 공룡 객체의 점프 기능을 호출
}

function keyPressed() {
    키보드 키를 눌렀을 때 공룡 객체의 점프 기능을 호출
}
```
의사코드를 살펴보니 오늘 구현할 프로그램의 구조가 대략 이해가 되시나요? 여기서 오늘 처음 보는 함수가 있는데요. 

바로 mousePressed(),keyPressed()함수 입니다. 이러한 함수는 이벤트 관련 함수라고 하는데 프로그래밍에서는 시간 순서대로만 프로그램이 진행되는 것이 아니라 임의의 시간에 발생하는 이벤트를 입력받아 처리합니다. 이벤트에는 키보드나 마우스 입력 이벤트나 또는 시간에 따라 주기적으로 발생하는 이벤트, 다른 프로그램에서 호출하는 다양한 이벤트가 존재합니다. 

!["이벤트 호출"](/assets/images/event_driven.png){: .align-center width="100%" height="100%"}


p5.js에서도 다양한 이벤트를 처리하는 함수를 만들어 놓았고 마우스 클릭의 종류, 키보드 입력의 종류, 터치스크린 입력, 가속도 센서의 입력 이벤트를 처리할 수 있답니다.

!["p5.js 이벤트 함수"](/assets/images/p5js_event.png){: .align-center width="100%" height="100%"}

자 그럼 이제 진짜로 코딩을 하여 공 모양의 공룡을 마우스나 키보드를 눌렀을 때 뛰어오르게 만들어 봅시다.

> ### 활동 1. 공룡 객체 점프시키기 

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500" data-p5-version="1.2.0">

class Dino{
  constructor(x, y, m, r) {
    this.pos = createVector(x, y - r);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.m = m;
    this.r = r;
  }

  jump() {
    this.vel.y = -5; //점프할 때 위로 뛰어오르는 속도
  }
  
  applyForce(force) {
    let f = p5.Vector.div(force, this.m);
    this.acc.add(f);
  }
  
  edge() {
    if (this.pos.y >= height - this.r) {
      this.pos.y = height - this.r;
    }
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }
  
  show() {
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}

function setup() {
  createCanvas(100, 100);
  tRex = new Dino(width/2, height, 5, 5);  //바닥 가운데 tRex 객체를 생성
}

function draw() {
  background(220);
  let gravity = createVector(0, 1); //중력가속도를 임의로 설정
  tRex.applyForce(gravity);
  tRex.update();
  tRex.edge();
  tRex.show();
}

function mousePressed() {
  tRex.jump();
}

function keyPressed() {
  tRex.jump();
}
</script>

가속도와 점프 속도를 조절해서 공룡게임에서의 공룡의 움직임과 비슷하게 만들어 보세요. 

자 드디어 우리는 키보드나 마우스를 이용해서 컴퓨터 세상을 조종할 수 있게 되었습니다.

> 오늘의 과제 
> 
> [p5.js 웹에디터](https://editor.p5js.org/) 에서 아래 과제를 해결한 여러분만의 프로그램을 클래스룸 댓글에 공유를 해주세요. 
> 위의 프로그램을 계속 실행시켜보면 클릭을 계속할 수록 공중에서도 위로 올라가는 것을 볼 수 있습니다. 
>
> (1) 클릭을 계속 하면 공중에서도 점프 기능이 작동하는 것을 있습니다. 바닥에 도달했을 때만 점프 기능이 작동하도록 만들어 보세요.
>
> (2) 키보드의 키중에 '윗방향 화살표 키'를 눌렀을 때만 점프 기능이 작동하도록 만들어 보세요. (아래 문법을 참고하세요) 

[* 문법 참고](https://p5js.org/ko/reference/#/p5/keyPressed "ref")