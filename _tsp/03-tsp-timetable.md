---
title: "외판원 순회 문제"
permalink: /tsp/tsp-timetable/
excerpt: "학교 시간표 문제에 적용"
last_modified_at: 2024-09-26
toc: true
toc_sticky: true
---

## 1. 이동 수업 시간표 최적화하기

학생들이 매 시간마다 교실을 이동하여 수업을 받는 경우에 이동 수업 시간표 최적화 문제는 TSP 문제로 볼 수 있으며, 유전 알고리즘으로 빠른 시간안에 최적해를 구할 수 있습니다. 실제 문제에 적용하려면 앞서 구현한 상황에서 몇 가지를 추가해서 고려해야 합니다.

{% capture notice-text1 %}
* 2차원 평면의 도시간 거리에서 3차원 좌표계내에서 거리를 구해야 한다. 
* 같은 층에서 이동하는 것과 층과 층 사이를 이동하는 것사이에 다른 가중치를 부여해야 한다.
{% endcapture %}
<div class="notice--warning">
  <h4 class="no_toc">교실이 3차원 공간에 분포한다. </h4>
  {{ notice-text1 | markdownify }}
</div>

{% capture notice-text2 %}
* 처음과 마지막 위치는 고정되게 하고 해당 거리를 포함하여 적합도를 계산한다.
* 필요하다면 중간에 급식실 위치도 추가하여 고려할 수 있다.
{% endcapture %}
<div class="notice--warning">
  <h4 class="no_toc">처음과 마지막 교실 위치가 정해져 있다. </h4>
  {{ notice-text2 | markdownify }}
</div>

유전 알고리즘으로 이동 수업 시간표의 최적화 문제를 해결하는 시뮬레이션 코드는 다음과 같습니다. 
가운데 무지개색 구의 위치가 시작 교실의 위치이며 파란선은 첫 수업 이동 경로를 나타내며, 노란선은 마지막 수업을 마치고 다시 시작 교실로 이동하는 경로를 나타냅니다. 

<p align="center">
<iframe src="/p5/tsp_timetable/" width="640" height="600" frameborder="0"></iframe>
</p>

```javascript
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

```


