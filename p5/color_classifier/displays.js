function displayWindow() {
  let h = 300;
  noStroke()
  fill(r, g, b);
  rect(0, 0, width, h);
}

function displayInfobox() {
  fill(98, 128, 158);
  noStroke();
  rect(0, yBorderBottom, width, height - yBorderBottom);

  stroke(255);
  strokeWeight(2);
  line(0, yBorderBottom, width, yBorderBottom);
}

function displayWheel() {
  // large circle
  stroke(255);
  strokeWeight(2);
  fill(98, 128, 158);
  circle(width / 2, yBorderBottom, 250);

  // center line
  stroke(255, 100);
  strokeWeight(2);
  line(width / 2, yBorderBottom, width / 2, yBorderBottom - 125);

  // text
  textSize(26);
  noStroke();
  textAlign(CENTER, CENTER);

  fill(0);
  text("dark", width / 2 - 55, yBorderBottom - 40);
  fill(255);
  text("bright", width / 2 + 55, yBorderBottom - 40);
}

function displayGuess() {
  let sum = guess[0] + guess[1];
  let percentDark = round(guess[0] / sum * 100);
  let percentBright = round(guess[1] / sum * 100);

  let ang;
  let str = "";
  if (percentDark > percentBright) {
    ang = map(percentDark, 0, 100, 0, -PI);
    str += percentDark + "%";
  } else if (percentDark < percentBright) {
    ang = map(percentBright, 0, 100, -PI, 0);
    str += percentBright + "%";
  } else {
    ang = map(percentBright, 0, 100, -PI, 0);
    str += percentBright + "%";
  }

  // indicator
  push();
  translate(width / 2, yBorderBottom);
  rotate(ang);

  stroke(30);
  strokeWeight(5);
  line(0, 0, 100, 0);

  if (percentDark == percentBright) {
    fill(30);
  } else {
    if (trainingLog[trainingLog.length - 1] == 1) {
      fill(40, 150, 23);
    } else if (trainingLog[trainingLog.length - 1] == 0) {
      fill(160, 13, 13);
    }
  }
  stroke(255);
  strokeWeight(2);
  circle(0, 0, 30);

  pop();


  // text
  noStroke();
  fill(0);
  textSize(14);
  textAlign(LEFT, CENTER);
  text("확실도 : ", width / 2 + 60, yBorderBottom + 25);
  text(str, width / 2 + 150, yBorderBottom + 25);

}

function displayNTrainings() {
  textSize(14);
  noStroke();
  textAlign(LEFT, CENTER);
  fill(0);
  text("훈련 횟수 : ", width / 2 + 60, yBorderBottom + 50);
  text(nTrainings, width / 2 + 150, yBorderBottom + 50);
}

function displayAccuracy() {
  let str = "";

  if (accuracy != undefined) {
    str += round(accuracy * 100) + "%";
  } else {
    str += "-";
  }

  textSize(14);
  noStroke();
  textAlign(LEFT, CENTER);
  fill(0);
  text("정답 예측율 :", width / 2 + 60, yBorderBottom + 75);
  text(str, width / 2 + 150, yBorderBottom + 75);
}

function displayClr() {
  let str = "rgb(" + r + ", " + g + ", " + b + ")";
  fill(255 - (r + b + g) / 3);
  textSize(14);
  text(str, 5, 16);
}