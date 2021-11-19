// ERNST SCHMIDT
// www.ernst-schmidt.com

// idea: https://www.youtube.com/watch?v=KO7W0Qq8yUE&feature=youtu.be
// most relevant source: https://www.youtube.com/playlist?list=PLRqwX-V7Uu6Y7MdSCaIfsxc561QI0U0Tb

// open file tree on the left to see all files!

let r, g, b;

function setup() {
  createCanvas(400, 400);
  yBorderBottom = height - 100;
  brain = new NeuralNetwork(3, 3, 2);
  brainDisplay = new NNVisualization(brain, 60, yBorderBottom + 20);
  nTrainings = 0;
  trainingLog = [];
  guess = [];
  accuracy = undefined;

  randomClr();
  predict(r, g, b);
  evaluate();
}

function draw() {
  displayWindow();
  displayWheel();
  displayInfobox();
  displayNTrainings();
  displayGuess();
  displayAccuracy();
  displayClr();
  brainDisplay.display();
}

function predict(r, g, b) {
  let inputs = [r / 255, g / 255, b / 255];
  guess = brain.guess(inputs);
}

function randomClr() {
  if (random() < .5) {
    r = floor(random(0, 50));
    g = floor(random(0, 50));
    b = floor(random(0, 50));
  } else {
    r = floor(random(201, 256));
    g = floor(random(201, 256));
    b = floor(random(201, 256));
  }
}

function evaluate() {
  let sumRGB = r + g + b;
  let result = false;
  if (sumRGB < 765 / 2 && guess[0] > guess[1]) {
    result = true;
  } else if (sumRGB < 765 / 2 && guess[0] < guess[1]) {
    result = false;
  } else if (sumRGB > 765 / 2 && guess[0] < guess[1]) {
    result = true;
  } else if (sumRGB > 765 / 2 && guess[0] > guess[1]) {
    result = false;
  }

  if (result) {
    trainingLog.push(1);
  } else {
    trainingLog.push(0);
  }

  if (trainingLog.length > 20) {
    trainingLog.splice(0, 1);
  }

  let sumResults = 0;
  if (trainingLog.length >= 20) {
    for (let i = 0; i < trainingLog.length; i++) {
      sumResults += trainingLog[i];
    }
    accuracy = sumResults / 20;
  }
}