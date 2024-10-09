let cities = [];
let totalCities = 7;
let cityName = ['A','B','C','D','E','F','G','H','I','J']

let order = [];
let count = 0;

let totalPermutations;

let recordDistance;
let bestOrder;

function setup() {
  createCanvas(640, 600);
  for (let i=0; i<totalCities; i++) {
    let v = createVector(random(width), random(height/2));
    cities[i] = v;
    order[i] = i;
  }
  
  recordDistance = calcDistance(cities, order);
  bestOrder = order.slice();
  
  totalPermutations = factorial(totalCities);
  
  console.log(totalPermutations);
  
}

function draw() {
  background(0);
  fill(255);
  textSize(15);
  for (let i=0; i<cities.length; i++) {
    ellipse(cities[i].x, cities[i].y, 8, 8);
    text(cityName[i], cities[i].x-10, cities[i].y-10);
  }

  stroke(255, 0, 255);
  strokeWeight(1);
  noFill();
  beginShape();
  for (var i = 0; i < cities.length; i++) {
    var n = bestOrder[i];
    vertex(cities[n].x, cities[n].y);
  }
  endShape();
  
  translate(0,height/2);
  
  stroke(255);
  strokeWeight(1);
  noFill();
  beginShape();
  for (let i=0; i<cities.length; i++) {
    let n = order[i];
    vertex(cities[n].x, cities[n].y);
  }
  endShape();
  
  let d = calcDistance(cities, order);
  if (d < recordDistance) {
    recordDistance = d;
    bestOrder = order.slice();
    console.log(recordDistance);
  }
     
  nextOrder();
  
  textSize(32);
  fill(255);
  let percent = 100 * (count / totalPermutations);
  
  text(nf(percent,0,2) + "% completed", 20, height/2-50);
}

function nextOrder(){
  count++;
  
  // STEP 1 of the algorithm
  // https://www.quora.com/How-would-you-explain-an-algorithm-that-generates-permutations-using-lexicographic-ordering
  var largestI = -1;
  for (let i = 0; i < order.length - 1; i++) {
    if (order[i] < order[i + 1]) {
      largestI = i;
    }
  }
  if (largestI == -1) {
    noLoop();
    console.log('finished');
  }

  // STEP 2
  var largestJ = -1;
  for (var j = 0; j < order.length; j++) {
    if (order[largestI] < order[j]) {
      largestJ = j;
    }
  }

  // STEP 3
  swap(order, largestI, largestJ);

  // STEP 4: reverse from largestI + 1 to the end
  var endArray = order.splice(largestI + 1);
  endArray.reverse();
  order = order.concat(endArray);
}

function swap(a, i, j) {
  var temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

function calcDistance(points, orders) {
  let sum = 0;
  for (let i = 0; i < orders.length - 1; i++) {
    var cityAIndex = orders[i];
    var cityA = points[cityAIndex];
    var cityBIndex = orders[i + 1];
    var cityB = points[cityBIndex];
    var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }
  return sum;
}

function factorial(n) {
  if (n == 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}