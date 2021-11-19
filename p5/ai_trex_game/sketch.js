const TOTAL = 50;  // 집단 개체수
let dinos = [];  // 공룡 배열
let saveDinos = [];  // 장애물과 충돌한 공룡 객체를 저장하
let cacti = [];  // 장애물 선인장 배열
let jumpVelocity = -7;  // 점프 속도
let runSpeed = 2;  // 장애물 이동 속도(공룡의 x 방향 이동속도)
let counter = 0;  // 장애물이 지나가는 빈도를 체크
let gameScore = 0;  // 스크린에 표시되는 게임 점수
let mass = 8;  // 공룡 객체 생성시 무게
let size = 10;  // 공룡 객체 생성시 크기
let generation = 1;  // 세대

class Dino {
  // 유전자로 이전 세대에서 학습된 인공 신경망 brain을 받아온다.
  constructor(x, y, m, r, brain) {
    this.pos = createVector(x, y - r);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.m = m;
    this.r = r;
    
    this.score = 0;  // 각 공룡이 오래 살아남은 정도
    this.fitness = 0;  // 공룡이 오래 살아남은 정도를 적응도로 계산
    
    // 첫 세대에서는 NeuralNetwork 클래스(nn.js안에 구현되어 있음)를 이용하여 brain 객체를 생성. 다음 세대에 인공신경망을 유전자처럼 전달.
    if (brain) {
      this.brain = brain.copy();
    } else {
      // 입력층 3개, 은닉층 8개, 출력층 2개를 의미.
      this.brain = new NeuralNetwork(3, 8, 2);
    }
  }
  
  jump() {
    if (this.pos.y == height - this.r) {
      this.vel.y = jumpVelocity;
    }
  }
  
  applyForce(force) {
    let f = p5.Vector.div(force, this.m);
    this.acc.add(f);    
  }
  
  update() {
    // 적응도는 오래 살아남은 정도를 의미.
    this.score++;
    
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
    
  }
  
  // 돌연변이는 nn.js에 구현된 mutate(발생확률) 함수를 사용
  mutate() {
    this.brain.mutate(0.5);
  }
  
  // 가장 가까운 장애물을 선택하여 인공 신경망 입력층에 정보를 입력하고 학습하여 점프할지 달릴지를 출력값으로 받아옴.
  think(cacti) {
    
    let closest = null;
    let closestD = Infinity;
    
    for (let i = 0; i < cacti.length; i++) {
      let d = (cacti[i].x + cacti[i].w) - this.pos.x;
      
      if (d < closestD && d > 0) {
        closest = cacti[i];
        closestD = d;
      }
    }
    
    // 입력층 3개(공룡 y위치, 장애물의 높이, 장애물의 x위치)
    let inputs = [];
    inputs[0] = this.pos.y / height;
    inputs[1] = closest.y / height;
    inputs[2] = closest.x / width;
    
    // 출력층 값을 받아와서 점프 확실도가 달리기 확실도 보다 높으면 점프 
    let output = this.brain.predict(inputs);
    if (output[0] > output[1]) {
      this.jump();
    }
  }
}

// 장애물 클래스
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
  }
}

// 이미지 파일만 로드함.용량 메모리 관계로 이번에는 소리 파일은 로드하지 않음.
function preload() {
  dinoRun_1 = loadImage('asset/dino_run1.png');
  dinoRun_2 = loadImage('asset/dino_run2.png');
  dinoJump = loadImage('asset/dino_jump.png');
  cactusImg = loadImage('asset/cactus.png');
  dinoDead = loadImage('asset/dino_dead.png');
  cloudImg = loadImage('asset/cloud.png');
}

function setup() {
  createCanvas(400, 200);
  //tRex = new Dino(width/10, height, 8, 20);
  
  for (let i = 0; i < TOTAL; i++) {
    dinos[i] = new Dino(width/10, height, mass, size);
  }
  
}

function draw() {
  background(220);
  
  let gravity = createVector(0, 2);
  
  // 선인장 장애물이 너무 가깝거나 너무 떨어지지 않도록 조건을 설정하여 장애물을 생성
  if ((random(1) < 0.01 && counter > 40) || cacti.length == 0 || cacti[cacti.length - 1].x < 50) {
    cacti.push(new Obstacle(random(10,20),random(20,30)));
    counter = 0;
  }
  counter++;
  
  for (let i = cacti.length - 1; i >= 0; i--) {
    cacti[i].move();
    cacti[i].show();
    
    // 장애물과 공룡의 충돌을 감지하고, 충돌하면 공룡 객체를 dinos 배열에서 제거하고 제거된 공룡을 saveDinos 배열에 저장함.
    for (let j = dinos.length - 1; j >= 0; j--) {
      if (dinos[j].collisionDetection(cacti[i])) {
        saveDinos.push(dinos.splice(j, 1)[0]);
      }
    }
    deleteObstacle(i);
  }
  
  // 각 공룡객체를 신경망으로 학습시키고 운동시킴
  for (let tRex of dinos) {
    tRex.think(cacti);
    tRex.applyForce(gravity);
    tRex.update();
    tRex.edge();
  }
  
  // 모든 공룡이 장애물과 충돌하여 세대가 전멸하면 교배풀에서 다음 세대를 구성
  if (dinos.length === 0) {
    counter = 0;
    nextGeneration();
    cacti = [];
  }

  for (let tRex of dinos) {
    tRex.show();
  }
  
  // 스크린에 점수와 세대를 표시함.
  showScore();
  showGeneration();
}


function deleteObstacle(i) {
  if ((cacti[i].x + cacti[i].w) < 0) {
    addPoint();
    cacti.splice(i, 1);
  }
}

function addPoint() {
  gameScore += 5;
}

function showScore() {
  textSize(20);
  text("점수 : ", width-120, 20)
  text(gameScore, width-50, 20);
}

function showGeneration() {
  textSize(20);
  text("세대 : ", 20, 20)
  text(generation, 80, 20);
}

//  집단의 모든 공룡의 적응도를 계산한다.적응도가 높은 공룡이 선택될 확률이 높으며 선택한 공룡으로 새로운 다음 세대 집단을 구성한다.
function nextGeneration() {
  calculateFitness();
  for (let i = 0; i < TOTAL; i++) {
    dinos[i] = pickOne();
  }
  saveDinos = [];
  
  gameScore = 0;
  generation ++;
}

// 적응도가 높은 공룡이 더 많이 선택되게 한다
function pickOne() {
  let index = 0;
  let r = random(1);
  while (r > 0) {
    r = r - saveDinos[index].fitness;
    index++;
  }
  index--;
  let tRex = saveDinos[index];

  let child = new Dino(width/10, height, mass, size, tRex.brain);
  child.mutate();
  return child;
}

// 적응도는 오래 살아남을 수록 높게 계산한다
function calculateFitness() {
  let sum = 0;
  for (let tRex of saveDinos) {
    sum += tRex.score;
  }
  for (let tRex of saveDinos) {
    tRex.fitness = tRex.score / sum;
  }
}






