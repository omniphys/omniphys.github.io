function mousePressed() {
  if (mouseY < yBorderBottom) {
    if (mouseX < width / 2) {
      brain.train([r / 255, g / 255, b / 255], [1, 0]);
    } else {
      brain.train([r / 255, g / 255, b / 255], [0, 1]);
    }
    nTrainings++;
    randomClr();
    predict(r, g, b);
    evaluate();
  }
}

function keyPressed() {
  if (key === "r" || key === "R") {
    setup();
  }
}