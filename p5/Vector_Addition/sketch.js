let vectors = [];
let btnReset;
let lblVector1;
let lblVector2;
let lblVector3;

function setup() {
  createCanvas(400, 400);
  btnReset = createButton('초기화');
  btnReset.position(330, height - 40);
  btnReset.mousePressed(drawReset);

  lblVector1 = createP();
  lblVector2 = createP();
  lblVector3 = createP();
  lblVector1.style('font-size', '20px');
  lblVector2.style('font-size', '20px');
  lblVector3.style('font-size', '20px');
  katex.render('\\vec A', lblVector1.elt);
  katex.render('\\vec B', lblVector2.elt);
  katex.render('\\vec C = \\vec A + \\vec B', lblVector3.elt);
  
  initVector();
}

function initVector() {
  //Initialize Vector
  let base1 = createVector(40, 200);
  let vec1 = createVector(80, -120);
  let v1 = new PhysVector(base1, vec1, 255, lblVector1);
  vectors.push(v1);

  let base2 = createVector(80, 240);
  let vec2 = createVector(80, 40);
  let v2 = new PhysVector(base2, vec2, 150, lblVector2);
  vectors.push(v2);
  
  let base3 = createVector(160, 200);
  let vec3 = p5.Vector.add(vec1, vec2);
  let v3 = new PhysVector(base3, vec3, 0, lblVector3);
  vectors.push(v3);   
}

function draw() {
  background(220);
  drawGrid();
  drawTitle();

  // 배열에 저장된 벡터 그리기
  for (let i = 0; i < vectors.length; i++) {
    vectors[i].over();
    vectors[i].update();
    vectors[i].draw();
  }
}

function mousePressed() {
  for (let i = 0; i < vectors.length; i++) {
    vectors[i].pressed();
  }
}

function mouseReleased() {
  for (let i = 0; i < vectors.length; i++) {
    vectors[i].released();
  }
}

function drawGrid() {
  for (var x = 0; x < width; x += width / 10) {
    for (var y = 0; y < height; y += height / 10) {
      stroke(200);
      strokeWeight(1);
      line(x, 0, x, height);
      line(0, y, width, y);
    }
  }
}

function drawTitle() {
  textSize(32);
  fill(0);
  stroke(255);
  strokeWeight(4);
  textFont('Do hyeon');
  text('벡터의 합성', 10, 30);
}

function drawReset() {
  vectors.length = 0;
  initVector();
}