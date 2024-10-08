---
title: "외판원 순회 문제"
permalink: /tsp/tsp-basic/
excerpt: "외판원 순회 문제 기초 알고리즘"
last_modified_at: 2024-09-26
toc: true
toc_sticky: true
---

!["TSP문제"](/assets/images/tsp.png){: .align-center width="80%" height="80%"}

외판원 순회 문제(TSP, Traveling Salesman Problem)는 조합 최적화 문제 중 하나로, 주어진 여러 도시를 한 번씩만 방문하고 출발했던 도시로 다시 돌아오는 최단 경로를 찾는 문제입니다. 이는 다음과 같은 조건을 만족해야 합니다:

> 1. 각 도시를 한 번씩만 방문해야 합니다.
> 2. 모든 도시를 방문한 후 다시 출발점으로 돌아와야 합니다.
> 3. 이동 거리를 최소화하는 경로를 찾는 것이 목적입니다.

이 문제는 도시의 수가 많아질수록 가능한 경로의 수가 기하급수적으로 증가하여 해결이 매우 어려워집니다. 도시의 수가 n일 때 가능한 경로의 수는 (n-1)!입니다. 예를 들어, 도시가 4개일 때 가능한 경로는 6가지이지만, 도시가 10개로 늘어나면 가능한 경로는 362,880가지가 됩니다.


TSP는 다음과 같은 분야에서 응용됩니다:

	•	물류 및 배송 경로 최적화
	•	공장 기계의 작업 경로, 반도체 회로의 최적화
	•	여행 계획 최적화


## 1. 임의의 도시를 생성하고 도시 사이의 거리 구하기
기본적인 형태를 만들기 위해 각 도시를 랜덤 함수를 이용하여 생성하고, 도시 배열에 지정된 인덱스 순서에 따라 이동한 거리를 합산하는 함수를 구현합니다. 또한 랜덤하게 두 도시의 순서를 변경하여 이동 거리가 더 작은 경로가 없는지 탐색해 보는 코드로 다음과 같이 구성할 수 있습니다.

```javascript
let cities = [];        // 도시 배열 선언
let totalCities = 20;   // 전체 도시의 갯수
let recordDistance;     // 도시 사이의 총 거리
let bestPath;           // 최적 경로

function setup() {
  createCanvas(400, 400);

  for (let i=0; i < totalCities; i++) {
    // 랜덤 함수로 임의의 도시 생성
    let v = createVector(random(width), random(height));
    cities[i] = v;
  }
  // 도시간 이동거리 초기 합산
  recordDistance = calcDistance(cities);
  // 최적 경로 초기화
  bestPath = cities.slice();
}

function draw() {
  background(0);
  fill(255);
  // 각 도시 표시
  for (let i=0; i<cities.length; i++) {
    ellipse(cities[i].x, cities[i].y, 8, 8);
  }
  
  // 도시를 잇는 선 그리기
  stroke(255);
  strokeWeight(1);
  noFill();
  beginShape();
  for (let i=0; i<cities.length; i++) {
    vertex(cities[i].x, cities[i].y);
  }
  endShape();

  // 최적 경로 표시하기
  stroke(255, 255, 0);
  strokeWeight(4);
  noFill();
  beginShape();
  for (let i=0; i<bestPath.length; i++) {
    vertex(bestPath[i].x, bestPath[i].y);
  }
  endShape();
  
  // 도시의 이동 순서를 랜덤하게 변경
  var i = floor(random(cities.length));
  var j = floor(random(cities.length));
  swap(cities, i, j);
  
  // 도시간 이동 거리를 다시 계산하여 이전 거리와 크기 비교
  let d = calcDistance(cities);
  if (d < recordDistance) {
    // 이전 거리합보다 작은 경로가 있으면 최적경로 배열에 저장하고 그 거리의 합을 콘솔창에 표시 
    recordDistance = d;
    bestPath = cities.slice();
    console.log(recordDistance);
  }   
}

// 임의의 두 도시를 선택해서 순서를 서로 바꿈
function swap(a, i, j) {
  var temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

// 도시간 거리를 합산하는 함수
function calcDistance(points) {
  var sum = 0;
  for (let i = 0; i < points.length -1 ; i++) {
    let d = dist(points[i].x, points[i].y, points[i+1].x, points[i+1].y);
    sum += d;
  }
  
  return sum;
}
```

## 2. 완전 탐색 방법 (Brute Force) 사용하기
위의 구현한 코드는 랜덤하게 순서를 바꿔가면서 최적 경로를 찾기 때문에 언제 최적값에 도달하는지 확인할 수 없는 문제점이 있습니다. 그래서 시간은 많이 걸리지만 모든 경우의 수를 따져가면서 처음부터 모든 경로를 탐색해보는 방법을 통해 TSP 문제를 해결할 수 있습니다. 순서대로 모든 도시간의 경로를 찾기 위해 사전식 순서(lexicographical order)를 사용할 수 있으며 다음 순열 알고리즘(Next Permutation Algorithm)이라고 합니다.

> 1. 가장 큰 x 찾기: 배열에서 P[x] < P[x+1]을 만족하는 가장 큰 x를 찾습니다. (만약 그런 x가 없다면, 현재 순열은 마지막 순열입니다.)
> 2. 가장 큰 y 찾기: P[x] < P[y]를 만족하는 가장 큰 y를 찾습니다.
> 3. P[x]와 P[y] 교환: P[x]와 P[y]를 서로 교환합니다.
> 4. P[x+1]부터 P[n]까지 반전: P[x+1]부터 배열의 끝까지 순서를 뒤집습니다.