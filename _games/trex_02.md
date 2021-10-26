---
title: "공룡 게임 만들기 2 - 장애물 이동"
permalink: /games/trex_02/
excerpt: "p5.js로 게임을 만들어 봅시다"
last_modified_at: 2021-10-25
toc: true
toc_sticky: true
---

이번 시간에는 크롬 공룡 게임의 장애물을 구현해 보도록 하겠습니다. 다시 한번 크롬 공룡 게임의 화면을 살펴봅시다.

!["공룡 게임 화면"](/assets/images/trex_game_01.jpeg){: .align-center width="100%" height="100%"}

공룡은 제자리에서 점프만 하고 배경과 장애물이 왼쪽으로 이동하게 됩니다. 이러한 게임을 횡스크롤 게임이라고 합니다.

과학시간에 배운 상대속도의 개념을 적용한 것이라고 볼 수 있겠습니다. 

우리는 움직이고 있는 버스 안에서 밖을 보면 버스 밖 세상은 버스가 움직이는 반대방향으로 움직이는 것과 마찬가지 원리입니다.

그럼 장애물 클래스를 구현하고 장애물을 이동시켜 봅시다.

## 1. 장애물 만들고 이동하기

지난 시간에 구현한 코드에 Obstacle 클래스를 추가하고 랜덤하게 장애물 객체인 cacti(선인장)을 생성하여 왼쪽으로 이동시켜보는 의사 코드는 다음과 같이 생각해 볼 수 있습니다.

```javascript

let 장애물 객체 배열 = [];

class Dino{
    기존 공룡 클래스
}

class Obstacle(w, h) {
  constructor(폭 초기값, 높이 초기값) {
    this.x위치 = 장애물 객체의 처음 x 위치;
    this.y위치 = 장애물 객체의 처음 y 위치;
    this.가로폭 = 장애물 객체의 가로폭;
    this.높이 = 장애물 객체의 높이;  
  }

  move() { this.x위치를 계속 왼쪽으로 이동시킴;}

  show() { 사각형 모양의 장애물 객체를 그림;
  }
}

function setup() { .... }

function draw() {
    랜덤한 시간에 장애물 객체 생성하여 배열에 저장;
    장애물 객체 배열에 저장된 객체를 이동시키며 그리기;
}

```

코드를 살펴보시면 장애물 객체는 한두개가 아니라 계속 생성되기 때문에 배열이라는 저장소에 넣어서 관리하게 됩니다.

이러한 코드는 이미 지난 온라인 수업의 '06. 입자계 물리' 내용 중에 불꽃놀이를 만들때 사용한 적이 있습니다.

[* 입자계 물리 내용 참고](/particles/ "ref")

그럼 작접 코당을 통해 장애물 클래스와 객체를 구현해 봅시다. 일단 아래 코드를 살펴보고 여러분 만의 코드를 구현해 봅시다.

> ### 활동 1. 장애물 객체 구현하기 

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="700" data-p5-version="1.2.0">

let cacti = [];

class Dino{
  constructor(x, y, m, r) {
    this.pos = createVector(x, y - r);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.m = m;
    this.r = r;
  }

  jump() {
    if (this.pos.y == height - this.r) {    // 기존 과제로 제시한 바닥에 도달한 상태에서만 점프가 가능하게 수정한 코드
      this.vel.y = -5;
    }
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
    stroke(0);
    fill(255,255,0,200)
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}

class Obstacle{
  constructor(w, h) {
    this.x = width;
    this.y = height - h;
    this.w = w;
    this.h = h;
  }
  
  move() {
    this.x -= 1;    // 장애물 객체의 이동 속도
  }
  
  show() {
    stroke(0);
    fill(0,255,0,100);
    rect(this.x, this.y, this.w, this.h);   // 장애물 객체를 사각형으로 그리기
  }
  
}

function setup() {
  createCanvas(100, 100);
  tRex = new Dino(width/10, height, 5, 5); // 공룡의 위치를 왼쪽으로 약간 이동시킴
}

function draw() {
  background(220);
  let gravity = createVector(0, 1);
  
  if (random(1) < 0.01) {   // 랜덤하게 객체 생성, 0.01은 1%의 확률로 객체가 생성되는 것을 의미함.
    cacti.push(new Obstacle(10,20));    // 폭 10, 높이 20의 장애물 객체를 생성하여 장애물 객체 배열에 추가함.
  }
  
  for (let i = cacti.length - 1; i >= 0; i--) {
    cacti[i].move();
    cacti[i].show();
  }
  
  tRex.applyForce(gravity);
  tRex.update();
  tRex.edge();
  tRex.show();
}

function mousePressed() {
  tRex.jump();
}

function keyPressed() {
  if (keyCode === UP_ARROW) {   // 기존 과제로 제시한 윗방향 키보드를 눌렀을 때만 점프하게 수정한 코드
    tRex.jump();
  }
}
</script>

일단 코드를 살펴보면 장애물 객체를 그릴 때 rect() 함수를 사용하는데 아래 문법을 참고하세요.

[* 문법 참고](https://p5js.org/ko/reference/#/p5/rect "ref")

그리고 배열.push() 는 배열안에 새로운 객체를 저장하는 것이고, for문을 이용하여 배열안의 값을 순서대로 반복하여 꺼내서 실행합니다.

이제 여러분이 직접 간단하게 장애물의 속도와 크기, 등장 빈도수를 조절해서 장애물이 다양한 모습을 나타낼 수 있도록 만들어 보세요.

자! 오늘은 이렇게 공룡의 여행을 방해하는 선인장 장애물을 만들어 보았습니다.

위의 제시한 코드가 이해가 되었으면 아래 과제를 해결해 봅시다.

> 오늘의 과제 
> 
> [p5.js 웹에디터](https://editor.p5js.org/) 에서 아래 과제를 해결한 여러분만의 프로그램을 클래스룸 댓글에 공유를 해주세요. 
>
> (1) random() 함수를 이용해서 장애물 마다 다양한 색깔, 다양한 크기, 다양한 속도를 적용해 보세요.
>
> (2) 배열을 사용하는 것은 결국에 컴퓨터 메모리를 사용하는 것과 같습니다. 만약 계속 장애물 객체를 생성하게 되면 오랜 시간이 되면 결국에 컴퓨터 메모리가 부족해질 수 도 있답니다. 그렇다면 이제 사용하지 않는 장애물 객체를 어떻게 처리하면 될까요? splice()함수를 이용해 보세요. '06. 입자계 물리' 내용 중에 불꽃놀이를 만들때 사용한 적이 있답니다.   

[* 문법 참고](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/splice "ref")