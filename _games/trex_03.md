---
title: "공룡 게임 만들기 3 - 충돌 감지 구현"
permalink: /games/trex_03/
excerpt: "p5.js로 게임을 만들어 봅시다"
last_modified_at: 2021-10-25
toc: true
toc_sticky: true
---

이번 시간에는 크롬 공룡 게임에서 엔딩 조건을 구현해 보겠습니다. 아래 화면처럼 크롬 공룡 게임은 공룡이 달리다가 선인장 모양의 장애물과 충돌하면 게임이 끝나게 되어 있습니다. 

!["공룡 게임 화면"](/assets/images/trex_game_02.png){: .align-center width="100%" height="100%"}

우리는 앞서서 공룡의 점프 기능과 장애물을 생성하여 이동시키는 과정까지 구현해 보았습니다. 이번에는 게임 엔딩 조건 구현을 위해서 공룡과 장애물 사이에 충돌 감지 기능을 추가하도록 하겠습니다.

## 1. 공룡과 장애물의 충돌 감지하기

게임과 물리엔진에서는 충돌 감지가 매우 중요합니다. 충돌 감지가 제대로 이루어지지 않으면 게임 상에서 타격감이 떨어지거나 게임 케릭터가 공간에 끼어서 움직이지 못하는 버그가 발생한답니다. 

우리는 충돌 감지를 간단하게 시작하기 위해 공룡은 원으로, 선인장 장애물은 사각형으로 가정해서 생각해보겠습니다.

tRex는 Dino 클래스에서 만들어진 객체이고, cactus는 Obstacle 클래스에서 만들어진 객체로 cacti[] 배열안에 저장된 객체 중의 특정한 하나를 말합니다.

공룡 객체 tRex와 선인장 장애물 객체 cactus가 충돌하였는지를 알아내기 위해서는 아래와 같은 과정을 거쳐야 합니다.

> 1. 공룡객체의 위치와 장애물 객체의 위치를 그림과 같이 표시.
> 2. 장애물은 사각형이므로 4개의 경계선 중에서 공룡과 가장 가까운 경계선을 선택. (그림의 빨간선)
> 3. 공룡의 중심 위치에서 가장 가까운 경계선에 수선을 그어 가장 가까운 점을 선택. (그림의 주황색 점)
> 4. 공룡의 중심 위치와 경계선의 가장 가까운 점 사이의 거리를 계산. (피타고라스 정리를 이용)
> 5. 두 점 사이의 거리가 공룡의 크기인 반지름 tRex.r 보다 작으면 충돌 한 것으로 판정. 


!["충돌 감지 과정"](/assets/images/collision_detection.png){: .align-center width="100%" height="100%"}

위의 충돌 감지 과정을 의사코드로 나타내면 다음과 같습니다. Dino 클래스 안에 새로운 함수인 충돌감지 함수 collisionDetection()을 추가하고, draw() 함수에서 장애물 객체마다 공룡과 충돌 감지 함수를 호출해 충돌 여부를 확인합니다. 

```javascript
class Dino{    
    // 기존 클래스에 충돌 감지 함수 추가
    collisionDetection(cactus) {
        if (this.pos.x<cactus.x) { 왼쪽 경계선 위 가장 가까운 점 x위치 결정; }
        else if (this.pos.x > cactus.x+cactus.w) { 오른쪽 경계선 위 가장 가까운 점 x위치 결정; }

        if (this.pos.y < cactus.y) { 위쪽 경계선 위 위 가장 가까운 점 y위치 결정; }
        else if (this.pos.y > cactus.y+cactus.h) { 아래쪽 경계선 위 가장 가까운 점 y위치 결정; }

        공룡과 경계선 위 가장 가까운 점 위치 사이의 거리를 구한다.

        if (두점 사이의 거리 <= 공룡의 크기) { return true; }
        else { return false; }
    }
}

class Obstacle(w, h) { .... }

function setup() { .... }

function draw() {    
    // 장애물 객체 배열에 저장된 객체를 이동시키며 그리기
    for (let i = cacti.length - 1; i >= 0; i--) {
        cacti[i].move();
        cacti[i].show();
        if (tRex.collisionDetection(cacti[i])) {
            공룡과 모든 장애물 사이에 충돌을 감지해보고 충돌하였으면 게임을 종료함. 
        }
        // 지난 차시 과제를 통해 추가된 지나간 장애물 객체 배열에서 제거하는 함수 호출
        deleteObstacle(i);
    }
}
```

의사 코드를 통해 전체적인 충돌 감지 과정을 이해할 수 있었나요? 이제 여러분이 직접 코딩을 해가며 충돌감지 기능을 구현해 보도록 하겠습니다.

> ### 활동 1. 공룡과 장애물 사이의 충돌 감지하기 

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="700" data-p5-version="1.2.0">

let cacti = [];    // 장애물 객체 배열을 선언. 참고로 cacti는 선인장의 복수형

class Dino{
  constructor(x, y, m, r) {
    this.pos = createVector(x, y - r);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.m = m;
    this.r = r;
  }

  jump() {
    if (this.pos.y == height - this.r) {
      this.vel.y = -5;
    }
  }
  
  applyForce(force) {
    let f = p5.Vector.div(force, this.m);
    this.acc.add(f);
  }
  
  collisionDetection(cactus) {  // 충돌감지 함수에서는 장애물 객체를 인수로 받음. 참고로 cactus는 선인장의 단수형
    // 경계선에서 가장 가까운 점을 나타내는 testX와 testY에 기본값을 저장
    let testX = this.pos.x;
    let testY = this.pos.y;
    
    // 공룡과 선인장(사각형 모양)의 어느쪽 경계가 가까운지 확인함.
    if (this.pos.x < cactus.x) {         
      testX = cactus.x;            // 장애물 왼쪽 경계선에서 가장 가까운 점 위치 결정 
    }
    else if (this.pos.x > cactus.x+cactus.w) { 
      testX = cactus.x+cactus.w;   // 장애물 오른쪽 경계선에서 가장 가까운 점 위치 결정 
    }
    
    if (this.pos.y < cactus.y) {  
      testY = cactus.y;            // 장애물 위쪽 경계선에서 가장 가까운 점 위치 결정 
    }
    else if (this.pos.y > cactus.y+cactus.h) {
      testY = cactus.y+cactus.h;   // 장애물 아래쪽 경계선에서 가장 가까운 점 위치 결정 
    }

    // 사각형 장애물의 가장 가까운 면에서 공룡까지의 거리 구하기
    let distX = this.pos.x-testX;
    let distY = this.pos.y-testY;
    let distance = sqrt( (distX*distX) + (distY*distY) );

    // 두점 사이의 거리가 공룡의 크기보다 작으면 충돌한 것으로 판정
    if (distance <= this.r) {
      return true;
    } 
    else {
      return false;
    }
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
    fill(255,255,0,200);
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
    this.x -= 1;
  }
  
  show() {
    stroke(0);
    fill(0,255,0,200);
    rect(this.x, this.y, this.w, this.h);
  }
  
}

function setup() {
  createCanvas(100, 100);
  tRex = new Dino(width/10, height, 5, 5);
}

function draw() {
  background(220);
  let gravity = createVector(0, 1);
  
  if (random(1) < 0.01) {
    cacti.push(new Obstacle(random(8,10),random(10,20)));
  }
  
  for (let i = cacti.length - 1; i >= 0; i--) {
    cacti[i].move();
    cacti[i].show();
    
    if (tRex.collisionDetection(cacti[i])) {
      // 충돌 판정이 나면 프로그램을 중단.
      noLoop();
    }

    // 지난 차시에서 과제로 제시한 지나간 장애물은 배열에서 제거하는 함수 호출
    deleteObstacle(i);
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
  if (keyCode === UP_ARROW) {
    tRex.jump();
  }
}

// 지난 차시에서 과제로 제시한 지나간 장애물은 배열에서 제거하는 함수
function deleteObstacle(i) {
  if ((cacti[i].x + cacti[i].w) < 0)
    cacti.splice(i, 1);
}
</script>

여러분이 직접 코딩을 하면서 공룡과 장애물 사이의 충돌 감지 과정에 대한 이해가 되었나요?

충돌이 감지되면 noLoop()함수를 이용해 프로그램을 중지시킵니다. 

충돌 감지 부분이 잘 이해가 안되면 한줄 한줄씩 천천히 따져가면서 살펴보시다 보면 이해하실 수 있을 것입니다. 그래도 잘 모르겠으면 선생님한테 와서 질문해 주세요!

자! 오늘은 공룡과 장애물 사이의 충돌 조건을 구현해 게임의 종료 상황까지 만들어 보았습니다.

게임의 완성도를 높이기 위해 아래 과제를 해결해 봅시다.

> 오늘의 과제 
> 
> [p5.js 웹에디터](https://editor.p5js.org/){:target="_blank"} 에서 아래 과제를 해결한 여러분만의 프로그램을 클래스룸 댓글에 공유를 해주세요. 
>
> (1) text() 함수를 이용해서 공룡이 장애물을 피하지 못하고 충돌하면 'GAME OVER' 메시지를 화면에 출력해보세요.
>
> (2) 공룡이 장애물과 충돌하였을 때 공룡의 색깔을 다른 색으로 바뀌게 만들어 보세요.  

[* 문법 참고](https://p5js.org/ko/reference/#/p5/text){:target="_blank"}