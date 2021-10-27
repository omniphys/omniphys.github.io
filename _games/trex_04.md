---
title: "공룡 게임 만들기 4 - 이미지, 사운드 추가하기"
permalink: /games/trex_04/
excerpt: "p5.js로 게임을 만들어 봅시다"
last_modified_at: 2021-10-27
toc: true
toc_sticky: true
---

지난 수업까지는 게임의 기본 기능을 구현하는데 집중했다면 이번 시간에는 우리가 만든 게임을 좀 더 게임답게 꾸며보는 과정을 진행하도록 하겠습니다. 무엇보다도 게임의 재미를 주는 것은 멋있는 그래픽과 음향효과입니다. 

이번 수업에서는 단순히 원과 직사각형으로 표현했던 공룡과 장애물을 이미지로 대체하고, 공룡이 점프할 때 효과음을 추가해 좀 더 실감나는 게임을 구현해 보도록 하겠습니다.

!["공룡 게임 이미지"](/assets/images/trex_game_img.png){: .align-center width="100%" height="100%"}

## 1. 이미지 추가하기

이번 수업부터는 블로그 내에 있는 

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="700" data-p5-version="1.2.0">

let cacti = [];    // cacti는 선인장의 복수형
let runSpeed = 2;
let jumpVelocity = -7;

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
      this.vel.y = jumpVelocity;
      //jumpSound.play();
    }
  }
  
  applyForce(force) {
    let f = p5.Vector.div(force, this.m);
    this.acc.add(f);
  }
  
  collisionDetection(cactus) {  // cactus는 선인장의 단수형
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
    imageMode(CENTER);
    if (frameCount % 4 == 0 || frameCount % 4 == 1)
      image(dinoRun_1, this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    else
      image(dinoRun_2, this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    
    //ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
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
  dinoRun_1 = loadImage('assets/images/dino_run1.png');
  dinoRun_2 = loadImage('assets/images/dino_run2.png');
  dinoJump = loadImage('assets/images/dino_jump.png');
  cactusImg = loadImage('assets/images/cactus.png');
  dinoDead = loadImage('assests/images/dino_dead.png');
  cloudImg = loadImage('assets/images/cloud.png');
  
  //jumpSound = loadSound('asset/jump.wav');
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
      tRex.c = color(255,0,0,200);
      text('GAME OVER', width/5, height/2);
      noLoop();
    }
    else {
      tRex.c = color(255,255,0,200);
    }
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

function deleteObstacle(i) {
  if ((cacti[i].x + cacti[i].w) < 0)
    cacti.splice(i, 1);
}
</script>

