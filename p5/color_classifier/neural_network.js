class NeuralNetwork {
  constructor(nInputNodes, nHiddenNodes, nOutputNodes) {
    // I = input
    // H = hidden
    // O = output

    this.nInputNodes = nInputNodes;
    this.nHiddenNodes = nHiddenNodes;
    this.nOutputNodes = nOutputNodes;

    this.weightsIH = new Matrix(this.nHiddenNodes, this.nInputNodes);
    this.weightsHO = new Matrix(this.nOutputNodes, this.nHiddenNodes);
    this.weightsIH.randomize(-1, 1, "float");
    this.weightsHO.randomize(-1, 1, "float");

    this.biasH = new Matrix(this.nHiddenNodes, 1);
    this.biasO = new Matrix(this.nOutputNodes, 1);
    this.biasH.randomize(-1, 1, "float");
    this.biasO.randomize(-1, 1, "float");

    this.learningRate = 0.6;

    this.inputs = [];
    this.guessesH = [];
    this.guessesO = [];
  }


  feedForward(inputArray, targetLayer) {
    let weights;
    let biases;

    switch (targetLayer) {
      case "hidden": // input -> hidden
        weights = this.weightsIH;
        biases = this.biasH;
        break;
      case "output": // hidden -> output
        weights = this.weightsHO;
        biases = this.biasO;
        break;
    }
    let inputs = Matrix.fromArray(inputArray);
    let outputs = Matrix.dot(weights, inputs);
    outputs.add(biases);

    return outputs.toArray();
  }

  train(inputArray, targetArray) {
    // feedForward input layer
    let outputH_unmapped = this.feedForward(inputArray, "hidden");
    let outputH = Matrix.mapArray(outputH_unmapped, sigmoid);

    // feedForward hidden layer
    let outputO_unmapped = this.feedForward(outputH, "output");
    let outputO = Matrix.mapArray(outputO_unmapped, sigmoid);

    // convert arrays to matrix objects
    outputO = Matrix.fromArray(outputO);
    let targets = Matrix.fromArray(targetArray);

    // calculate H -> O errors
    let outputErrors = Matrix.subtract(targets, outputO);

    // calculate H -> O gradients 
    let gradientsHO = Matrix.fromArray(Matrix.mapArray(outputO_unmapped, dSigmoid));
    gradientsHO.multiply(outputErrors);
    gradientsHO.multiply(this.learningRate);

    // calculate H -> O deltas 
    let outputH_trans = Matrix.transpose(Matrix.fromArray(outputH));
    let weightsHO_deltas = Matrix.dot(gradientsHO, outputH_trans);

    // adjust H -> O weights by deltas
    this.weightsHO.add(weightsHO_deltas);

    // adjust H -> 0 biases by gradients
    this.biasO.add(gradientsHO);

    // calculate I -> H errors
    let weightsHO_trans = Matrix.transpose(this.weightsHO);
    let hiddenErrors = Matrix.dot(weightsHO_trans, outputErrors);

    // calculate I -> H gradients 
    let gradientsIH = Matrix.fromArray(Matrix.mapArray(outputH_unmapped, dSigmoid));
    gradientsIH.multiply(hiddenErrors);
    gradientsIH.multiply(this.learningRate);

    // calculate I -> H deltas 
    let inputs_trans = Matrix.transpose(Matrix.fromArray(inputArray));
    let weightsIH_deltas = Matrix.dot(gradientsIH, inputs_trans);

    // adjust I -> H weights by deltas
    this.weightsIH.add(weightsIH_deltas);

    // adjust I -> H biases by gradients
    this.biasH.add(gradientsIH);
  }

  guess(inputArray) {
    this.inputs = inputArray;
    // feedForward input layer
    let outputH_unmapped = this.feedForward(inputArray, "hidden");
    let outputH = Matrix.mapArray(outputH_unmapped, sigmoid);
    this.guessesH = outputH;

    // feedForward hidden layer
    let outputO_unmapped = this.feedForward(outputH, "output");
    let outputO = Matrix.mapArray(outputO_unmapped, sigmoid);
    this.guessesO = outputO;
    return outputO;
  }
}

class NNVisualization {
  constructor(nn, x, y) {
    this.nInputNodes = nn.nInputNodes;
    this.nHiddenNodes = nn.nHiddenNodes;
    this.nOutputNodes = nn.nOutputNodes;

    this.inputNodes = [];
    this.hiddenNodes = [];
    this.outputNodes = [];

    this.connectionsIH = new Matrix(this.nHiddenNodes, this.nInputNodes);
    this.connectionsHO = new Matrix(this.nOutputNodes, this.nHiddenNodes);

    this.x = x;
    this.y = y;

    this.dXLayer = 60;
    this.dYNode = 30;

    // populate node arrays
    for (let i = 0; i < this.nInputNodes; i++) {
      this.inputNodes.push(new Node(x, y + i * this.dYNode));
    }

    for (let i = 0; i < this.nHiddenNodes; i++) {
      this.hiddenNodes.push(new Node(x + this.dXLayer, y + i * this.dYNode));
    }

    for (let i = 0; i < this.nOutputNodes; i++) {
      this.outputNodes.push(new Node(x + 2 * this.dXLayer, y + this.dYNode / 2 + i * this.dYNode));
    }

    // populate connection arrays
    for (let i = 0; i < this.nHiddenNodes; i++) {
      for (let j = 0; j < this.nInputNodes; j++) {
        this.connectionsIH.data[i][j] = new Connection(this.inputNodes[j], this.hiddenNodes[i]);
      }
    }

    for (let i = 0; i < this.nOutputNodes; i++) {
      for (let j = 0; j < this.nHiddenNodes; j++) {
        this.connectionsHO.data[i][j] = new Connection(this.hiddenNodes[j], this.outputNodes[i]);
      }
    }

  }

  display() {
    // display connections
    let clr;
    let strength;
    for (let i = 0; i < this.nHiddenNodes; i++) {
      for (let j = 0; j < this.nInputNodes; j++) {
        strength = map(abs(brain.weightsIH.data[i][j]), 0, 1, 0, 255);
        if (brain.weightsIH.data[i][j] < 0) {
          clr = color(0, 0, 255, strength);
        } else {
          clr = color(255, 0, 0, strength);
        }

        this.connectionsIH.data[i][j].display(clr);
      }
    }

    for (let i = 0; i < this.nOutputNodes; i++) {
      for (let j = 0; j < this.nHiddenNodes; j++) {
        strength = map(abs(brain.weightsIH.data[i][j]), 0, 1, 0, 255);
        if (brain.weightsHO.data[i][j] < 0) {
          clr = color(0, 0, 255, strength);
        } else {
          clr = color(255, 0, 0, strength);
        }
        this.connectionsHO.data[i][j].display(clr);
      }
    }

    // display nodes
    for (let i = 0; i < this.nInputNodes; i++) {
      strength = map(brain.inputs[i], 0, 1, 0, 255);
      this.inputNodes[i].display(strength);
    }
    for (let i = 0; i < this.nHiddenNodes; i++) {
      strength = map(brain.guessesH[i], 0, 1, 0, 255);
      this.hiddenNodes[i].display(strength);
    }
    for (let i = 0; i < this.nOutputNodes; i++) {
      strength = map(brain.guessesO[i], 0, 1, 0, 255);
      this.outputNodes[i].display(strength);
    }

    // display text left
    let str = "";
    let dX = -48;
    noStroke();
    fill(0);
    textSize(14);
    textAlign(LEFT, CENTER);
    str = "r: " + r;
    text(str, this.x + dX, this.inputNodes[0].y);
    str = "g: " + g;
    text(str, this.x + dX, this.inputNodes[1].y);
    str = "b: " + b;
    text(str, this.x + dX, this.inputNodes[2].y);

    // display text right
    dX = 2 * this.dXLayer + 10;
    if (guess[0] > guess[1]) {
      textStyle(BOLD);
    } else {
      textStyle(NORMAL);
    }
    str = "dark";
    text(str, this.x + dX, this.outputNodes[0].y);

    if (guess[0] < guess[1]) {
      textStyle(BOLD);
    } else {
      textStyle(NORMAL);
    }
    str = "bright";
    text(str, this.x + dX, this.outputNodes[1].y);
    textStyle(NORMAL);
  }
}

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.d = 10;
  }

  display(strength) {
    fill(255, 255, 255 - strength)
    stroke(0);
    strokeWeight(1);
    circle(this.x, this.y, this.d);
  }
}

class Connection {
  constructor(nodeA, nodeB) {
    this.x1 = nodeA.x;
    this.x2 = nodeB.x;
    this.y1 = nodeA.y;
    this.y2 = nodeB.y;
  }

  display(clr) {
    stroke(clr);
    strokeWeight(3);
    line(this.x1, this.y1, this.x2, this.y2);
  }

}