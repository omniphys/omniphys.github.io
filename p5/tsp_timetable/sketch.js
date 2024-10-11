let positions = [];
let startPos;
const totalClass = 12;

const popSize = 300;
const fitness = [];

let population = [];
let recordDistance = Infinity;
let bestOrder;

function setup() {
  createCanvas(640, 600, WEBGL);
  camera(-100, -450, 550);
  debugMode();
  // 3차원 위치 정보를 배열에 추가
  startPos = createVector(0,0,0);
  positions.push(createVector(-100, 0, -100));
  positions.push(createVector(50, -50, 100));
  positions.push(createVector(100, -50, 100));
  positions.push(createVector(-50, -50, -50));
  positions.push(createVector(50, -50, -50));
  positions.push(createVector(-100, -100, -50));
  positions.push(createVector(100, -100, 100));
  positions.push(createVector(-50, -150, 70));
  positions.push(createVector(100, -200, 100));
  positions.push(createVector(-50, -200, -50));
  positions.push(createVector(-100, -200, -50));
  positions.push(createVector(100, -200, 100));
  
  // 배열에 있는 위치 정보 출력
  for (let i = 0; i < positions.length; i++) {
    let pos = positions[i];
  }
  
  const order = [];
  for (let i = 0; i < totalClass; i++) {
    order[i] = i;
  }
  
  for (let i = 0; i < popSize; i++) {
    population[i] = shuffle(order);
    
  }
}

function draw() {
  background(220);
  
  // 카메라 설정
  orbitControl(); // 마우스로 3D 회전
  
  calculateFitness();
  normalizeFitness();
  nextGeneration();
  
  
  // 배열에 있는 3차원 위치 정보를 시각적으로 표현
  push();
  translate(startPos.x, startPos.y, startPos.z); // 3차원 위치로 이동
  normalMaterial();
  sphere(10); // 해당 위치에 구를 그립니다.
  pop();
  
  for (let i = 0; i < positions.length; i++) {
    let pos = positions[i];    
    push();
    translate(pos.x, pos.y, pos.z); // 3차원 위치로 이동
    sphere(2); // 해당 위치에 구를 그립니다.
    pop();
  }
  
  stroke(0,0,255);
  strokeWeight(3);
  line(startPos.x, startPos.y, startPos.z, positions[bestOrder[0]].x, positions[bestOrder[0]].y, positions[bestOrder[0]].z);

  for (let i = 0; i < bestOrder.length-1; i++) {
    let n1 = bestOrder[i];
    let n2 = bestOrder[i+1];
    let pos1 = positions[n1];
    let pos2 = positions[n2];
    stroke(255,0,0);
    line(pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z);
  } 
  
  stroke(255,255,0);
  line(positions[bestOrder[totalClass-1]].x, positions[bestOrder[totalClass-1]].y, positions[bestOrder[totalClass-1]].z, startPos.x, startPos.y, startPos.z);
  
  stroke(0);
  strokeWeight(1);
}

function swap(a, i, j) {
    const temp = a[i];
    a[i] = a[j];
    a[j] = temp;
}


function calcDistance(points, order) {
  let sum = 0;
  for (let i = 0; i < order.length - 1; i++) {
    const classAIndex = order[i];
    const classA = points[classAIndex];
    const classBIndex = order[i + 1];
    const classB = points[classBIndex];
    const d = dist(classA.x, classA.y, classA.z, classB.x, classB.y, classB.z);
    sum += d;
  }
  
  const d_i = dist(startPos.x, startPos.y, startPos.z, points[order[0]].x, points[order[0]].y, points[order[0]].z);
  
  const d_f = dist(startPos.x, startPos.y, startPos.z, points[order[totalClass-1]].x, points[order[totalClass-1]].y, points[order[totalClass-1]].z);
  
  sum += d_i + d_f;
  return sum;
}

function calculateFitness() {
  let currentRecord = Infinity;
  for (let i = 0; i < population.length; i++) {
    const d = calcDistance(positions, population[i]);
    if (d < recordDistance) {
      recordDistance = d;
      bestOrder = population[i];
    }

    fitness[i] = 1 / (pow(d, 8) + 1);
  }
}

function normalizeFitness() {
  let sum = 0;
  for (let i = 0; i < fitness.length; i++) {
    sum += fitness[i];
  }
  for (let i = 0; i < fitness.length; i++) {
    fitness[i] = fitness[i] / sum;
  }
}

function nextGeneration() {
  const newPopulation = [];
  for (var i = 0; i < population.length; i++) {
    const orderA = pickOne(population, fitness);
    const orderB = pickOne(population, fitness);
    const order = crossOver(orderA, orderB);
    mutate(order, 0.01);
    newPopulation[i] = order;
  }
  population = newPopulation;

}

function pickOne(list, prob) {
  let index = 0;
  let r = random(1);

  while (r > 0) {
    r = r - prob[index];
    index++;
  }
  index--;
  return list[index].slice();
}

function crossOver(orderA, orderB) {
  const start = floor(random(orderA.length));
  const end = floor(random(start + 1, orderA.length));
  const neworder = orderA.slice(start, end);

  for (let i = 0; i < orderB.length; i++) {
    const classOrder = orderB[i];
    if (!neworder.includes(classOrder)) {
      neworder.push(classOrder);
    }
  }
  return neworder;
}


function mutate(order, mutationRate) {
  for (let i = 0; i < totalClass; i++) {
    if (random(1) < mutationRate) {
      const indexA = floor(random(order.length));
      const indexB = (indexA + 1) % totalClass;
      swap(order, indexA, indexB);
    }
  }
}