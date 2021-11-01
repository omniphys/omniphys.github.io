---
title: "공룡 게임 만들기 5 - 정리"
permalink: /games/trex_05/
excerpt: "p5.js로 게임을 만들어 봅시다"
last_modified_at: 2021-11-01
toc: true
toc_sticky: true
---

지금까지 우리는 p5.js를 이용하여 공룡 게임을 만들어 보았습니다. 

이번 시간은 우리가 해온 과정을 정리하는 시간으로 준비했습니다.

전체 코딩 과정을 선생님이 설명을 하면서 동영상으로 만들어 보았는데, 동영상을 보면서 게임 개발 과정을 다시 한번 정리해보길 바랍니다. 

외부 라이브러리를 어떻게 사용하는지에 대한 내용도 담고 있으니 꼭 시청하길 바랍니다.

## 1. 공룡 게임 만들기 과정 설명 동영상

<iframe width="560" height="315" src="https://www.youtube.com/embed/cGwzRnBB2Ik" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

{% capture notice-text %}
* 다음 수업 시간부터는 우리가 만든 공룡 게임에 인공지능 기술(유전 알고리즘을 이용한 강화학습, 인공 신경망)을 적용하는 내용을 다루도록 하겠습니다. 
* 관심있는 학생들은 적극적으로 따라와 주시고 질문이 있으면 언제든지 클래스룸에 댓글을 달아주시거나 교무실로 와서 질문하시기 바랍니다.
* 이 강의가 여러분에게 도움이 되기를 진심으로 바랍니다. 
{% endcapture %}
<div class="notice--warning">
  <h4 class="no_toc">다음 수업 안내</h4>
  {{ notice-text | markdownify }}
</div>

## 2. 공룡 게임 만들기 전체 코드

```javascript
let cacti = [];
let jumpVelocity = -7;
let runSpeed = 2;
let score = 0;

class Dino {
  constructor(x, y, m, r) {
    this.pos = createVector(x, y - r);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.m = m;
    this.r = r;
  }
  
  jump() {
    if (this.pos.y == height - this.r) {
      this.vel.y = jumpVelocity;
      jumpSound.play();
    }
  }
  
  applyForce(force) {
    let f = p5.Vector.div(force, this.m);
    this.acc.add(f);    
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);    
  }
  
  edge() {
    if (this.pos.y >= height - this.r) {
      this.pos.y = height - this.r;
    }    
  }
  
  collisionDetection(cactus) {
    // 경계 검사 기본값을 세팅
    let testX = this.pos.x;
    let testY = this.pos.y;
    
    // 공룡과 선인장(사각형 모양)의 어느쪽 경계가 가까운지 확인함.
    if (this.pos.x < cactus.x) {         
      testX = cactus.x;            // 장애물 왼쪽 위치 확인
    }
    else if (this.pos.x > cactus.x+cactus.w) { 
      testX = cactus.x+cactus.w;   // 장애물 오른쪽 위치 확인
    }
    
    if (this.pos.y < cactus.y) {         
      testY = cactus.y;            // 장애물 위쪽 위치 확인
    }
    else if (this.pos.y > cactus.y+cactus.h) { 
      testY = cactus.y+cactus.h;   // 장애물 아래쪽 위치 확인
    }

    // 사각형 장애물의 가장 가까운 면에서 공룡까지의 거리 구하기
    let distX = this.pos.x-testX;
    let distY = this.pos.y-testY;
    let distance = sqrt( (distX*distX) + (distY*distY) );

    // 두점 사이의 거리가 공룡크기보다 작으면 충돌 판정
    if (distance <= this.r) {
      return true;
    } 
    else {
      return false;
    }
  }
  
  show() {
    imageMode(CENTER);
    if (frameCount % 4 == 0 || frameCount % 4 == 1)
      image(dinoRun_1, this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    else
      image(dinoRun_2, this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    
    //ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);    
  }
}

class Obstacle {
  constructor(w, h) {
    this.x = width;
    this.y = height - h;
    this.w = w;
    this.h = h;
  }
  
  move() {
    this.x -= runSpeed;
  }
  
  show() {
    imageMode(CORNER);
    image(cactusImg, this.x, this.y, this.w, this.h);
    //stroke(0);
    //fill(0,255,0,200);
    //rect(this.x, this.y, this.w, this.h);    
  }
}

function preload() {
  dinoRun_1 = loadImage('asset/dino_run1.png');
  dinoRun_2 = loadImage('asset/dino_run2.png');
  dinoJump = loadImage('asset/dino_jump.png');
  cactusImg = loadImage('asset/cactus.png');
  dinoDead = loadImage('asset/dino_dead.png');
  cloudImg = loadImage('asset/cloud.png');
  
  jumpSound = loadSound('asset/jump.wav');
  scoreSound = loadSound('asset/point.wav');
  endSound = loadSound('asset/die.wav');  
}

function setup() {
  createCanvas(400, 200);
  tRex = new Dino(width/10, height, 8, 20);
}

function draw() {
  background(220);
  let gravity = createVector(0, 2);
  
  if (random(1) < 0.01) {
    cacti.push(new Obstacle(random(10,20),random(20,30)));
  }
  
  for (let i = cacti.length - 1; i >= 0; i--) {
    cacti[i].move();
    cacti[i].show();
    
    if (tRex.collisionDetection(cacti[i])) {
      gameOver();
    }
    deleteObstacle(i);
  }
  
  tRex.applyForce(gravity);
  tRex.update();
  tRex.edge();
  tRex.show(); 
  
  showScore();
}

function mousePressed() {
  tRex.jump();
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    tRex.jump();
  }
}

function gameOver() {
  endSound.play();
  textSize(20);
  text('GAME OVER', width/3, height/2);
  noLoop();
}

function deleteObstacle(i) {
  if ((cacti[i].x + cacti[i].w) < 0) {
    addPoint();
    cacti.splice(i, 1);
  }
}

function addPoint() {
  score += 5;
  if (score % 50 == 0) {
    scoreSound.play();
  }
}

function showScore() {
  textSize(20);
  text("Score : ", width-120, 30)
  text(score, width-50, 30);
}
```
<a href="https://editor.p5js.org/physics-mulberry/sketches/J6mzUkJ--" target="_blank" class="btn btn--danger">웹에디터 코드 실행하기</a>
<a href="/assets/images/trex_game_asset.zip" class="btn btn--primary">이미지, 사운드 파일</a>

