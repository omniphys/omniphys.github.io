---
title: "외판원 순회 문제"
permalink: /tsp/tsp-ga/
excerpt: "외판원 순회 문제의 유전 알고리즘 적용"
last_modified_at: 2024-09-26
toc: true
toc_sticky: true
---

## 1. 유전 알고리즘 적용하기

TSP(외판원 순회 문제)는 도시의 수가 증가할수록 가능한 경로의 수가 기하급수적으로 증가하는 문제로, 완전 탐색, 랜덤 탐색으로는 현실적으로 해결이 어렵습니다. 그래서 큰 탐색 공간에서 효율적으로 근사해를 찾을 수 있는 유전 알고리즘이 효율적일 수 있습니다.

{% capture notice-text1 %}
* 유전 알고리즘은 한 번에 여러 해를 동시에 탐색하는 집단 기반 탐색 기법입니다. 초기에는 무작위로 여러 개의 경로(해)를 생성하고, 이 경로들을 교차 및 돌연변이 과정을 통해 새로운 경로들을 생성합니다. 이 방식은 단일 경로를 탐색하는 방법보다 훨씬 넓은 탐색 공간을 빠르게 탐험할 수 있습니다.

{% endcapture %}
<div class="notice--warning">
  <h4 class="no_toc">1. 탐색 공간의 효율적 탐험</h4>
  {{ notice-text1 | markdownify }}
</div>

{% capture notice-text2 %}
* 유전 알고리즘은 정확한 최적해를 찾는 것이 아니라 최적해에 가까운 근사해를 찾는 데 적합합니다. 특히 도시의 수가 많아져서 완전 탐색이 불가능한 상황에서는, 유전 알고리즘을 통해 상대적으로 빠르게 좋은 해를 얻을 수 있습니다.

{% endcapture %}
<div class="notice--warning">
  <h4 class="no_toc">2. 근사해를 빠르게 찾을 수 있음</h4>
  {{ notice-text2 | markdownify }}
</div>

{% capture notice-text3 %}
* 유전 알고리즘은 돌연변이와 교차 연산을 통해 해집단의 다양성을 유지합니다. 이는 지역 최적해(Local Optimum)에 빠지는 문제를 방지하고, 더 넓은 탐색 공간에서 보다 나은 해를 찾는 가능성을 높여줍니다.

{% endcapture %}
<div class="notice--warning">
  <h4 class="no_toc">3. 다양성 유지</h4>
  {{ notice-text3 | markdownify }}
</div>

{% capture notice-text4 %}
* 유전 알고리즘은 세대를 거듭할수록 해의 품질이 점진적으로 향상됩니다. 자연 선택을 모방한 적합도 기반의 선택 과정을 통해, 더 나은 경로들이 살아남고 교배되며 시간이 지날수록 더 짧은 경로를 찾을 확률이 높아집니다. 이 과정은 직관적으로 자연 선택에 기반하고 있어 이해하기 쉽고, 성능도 점진적으로 향상됩니다.

{% endcapture %}
<div class="notice--warning">
  <h4 class="no_toc">4. 점진적 향상 가능</h4>
  {{ notice-text1 | markdownify }}
</div>

수업의 순서와 위치를 유전 알고리즘의 유전자로 설정하고 학생의 이동거리가 최소가 되도록 적응도를 설정하여 유전알고리즘을 적용하면 빠르게  근사해를 찾는 것을 확인할 수 있습니다. TSP 문제에서 유전 알고리즘은 다음과 같이 작동합니다.

> 1. 집단 생성 (Population) : 진화가 이루어질 수 있도록 다양한 유전자(도시의 순서 : order)를 가진 충분한 개체를 만들어 줍니다. 이 때 shuffle() 함수를 이용하여 도시간 이동순서 order를 적절히 섞어줍니다. 
!["TSP_ga_01"](/assets/images/tsp_ga_01.png){: .align-center width="100%" height="100%"}
> 2. 선택 : 집단의 적합도(Fitness : 거리의 합이 작을수록 높은 적합도를 가짐)를 평가하여 다음 세대의 부모로 적합한 개체를 결정하는 단계입니다. 그리고 적합도를 뽑힐 확률로 활요하기 위해 0~1사이의 값으로 정규화합니다.
!["TSP_ga_02"](/assets/images/tsp_ga_02.png){: .align-center width="100%" height="100%"}
> 3. 교차 (Crossover) : 문제 해결을 잘 한 부모 개체를 선택하여 유전자를 섞어 자식 세대를 만듭니다. pickOne()함수를 통해 
> 4. 돌연변이 : 진화의 다양성을 위해 자식 세대의 유전자 중 일부는 돌연변이가 일어나게 합니다.
> 5. 새로운 세대 생성
!["TSP_ga_03"](/assets/images/tsp_ga_03.png){: .align-center width="100%" height="100%"}

유전 알고리즘으로 TSP의 근사해를 구하는 시뮬레이션 코드는 다음과 같습니다. 
아래 시뮬레이션의 위쪽 보라색 경로는 유전 알고리즘에서 여러 세대에 걸쳐서 최적 경로를 나타내는 것이고, 아래 흰색 경로는 해당 세대 내에서 적합도가 가장 큰 경로를 나타내는 것입니다.

<p align="center">
<iframe src="/p5/tsp_ga/" width="640" height="600" frameborder="0"></iframe>
</p>

```javascript
const cities = [];
const totalCities = 15;

const popSize = 500;
const fitness = [];

let population = [];
let recordDistance = Infinity;
let bestEver;
let currentBest;


function setup() {
  createCanvas(600, 600);
  const order = [];
  for (let i = 0; i < totalCities; i++) {
    const v = createVector(random(width), random(height / 2));
    cities[i] = v;
    order[i] = i;
  }

  for (let i = 0; i < popSize; i++) {
    population[i] = shuffle(order);
  }
}

function draw() {
  background(0);

  calculateFitness();
  normalizeFitness();
  nextGeneration();

  stroke(255,0,255);
  strokeWeight(1);
  noFill();
  beginShape();
  for (let i = 0; i < bestEver.length; i++) {
    const n = bestEver[i];
    vertex(cities[n].x, cities[n].y);
    ellipse(cities[n].x, cities[n].y, 8, 8);
  }
  endShape();

  translate(0, height / 2);
  stroke(255);
  strokeWeight(1);
  noFill();
  beginShape();
  for (let i = 0; i < currentBest.length; i++) {
    const n = currentBest[i];
    vertex(cities[n].x, cities[n].y);
    ellipse(cities[n].x, cities[n].y, 8, 8);
  }
  endShape();

}

function swap(a, i, j) {
  const temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}


function calcDistance(points, order) {
  let sum = 0;
  for (let i = 0; i < order.length - 1; i++) {
    const cityAIndex = order[i];
    const cityA = points[cityAIndex];
    const cityBIndex = order[i + 1];
    const cityB = points[cityBIndex];
    const d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }
  return sum;
}

function calculateFitness() {
  let currentRecord = Infinity;
  for (let i = 0; i < population.length; i++) {
    const d = calcDistance(cities, population[i]);
    if (d < recordDistance) {
      recordDistance = d;
      bestEver = population[i];
    }
    if (d < currentRecord) {
      currentRecord = d;
      currentBest = population[i];
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
    const city = orderB[i];
    if (!neworder.includes(city)) {
      neworder.push(city);
    }
  }
  return neworder;
}


function mutate(order, mutationRate) {
  for (let i = 0; i < totalCities; i++) {
    if (random(1) < mutationRate) {
      const indexA = floor(random(order.length));
      const indexB = (indexA + 1) % totalCities;
      swap(order, indexA, indexB);
    }
  }
}

```