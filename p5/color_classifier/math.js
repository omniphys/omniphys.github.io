function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

function dSigmoid(x) {
  // calculates derivative of sigmoid function
  return sigmoid(x) * (1 - sigmoid(x));
}