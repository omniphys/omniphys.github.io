let lifetime;
let lifeCounter;
let mutationRate;
let population;
let target;
const maxforce = 0.1;
let btnStart;
let btnReset;

function setup() {
  createCanvas(600, 360);
  
  btnStart = createButton('시작');
  btnStart.position(280, height - 40);
  btnStart.mousePressed(start);
  
  btnReset = createButton('정지');
  btnReset.position(330, height - 40);
  btnReset.mousePressed(reset);
  init();

  noLoop();
   
}

function start() {
  loop();
}


function reset() {
  init();
  noLoop();
}

function init() {
  lifetime = height;  
  lifeCounter = 0;
  mutationRate = 0.01;
  population = new Population(mutationRate, 50);
  
  target = createVector(width/2, 24);

}

function draw() {
  background(220);
  
  ellipse(target.x, target.y, 24, 24);

  if (lifeCounter < lifetime) {
    population.live();
    lifeCounter++;
  } else {
    lifeCounter = 0;
    population.fitness();
    population.selection();
    population.reproduction();
  }
  
  text("세대 : " + population.generations, 10, 30);
  text("남은 수명 : " + (lifetime - lifeCounter), 10, 50);

}

function mousePressed() {
  
  if (mouseY < 200) {
    target.x = mouseX;
    target.y = mouseY;
  }
}

class DNA {
  constructor(genes) {
    if (genes) {
      this.genes = genes;
    } else {
      this.genes = [];
      for (let i = 0; i < lifetime; i++) {
        this.genes[i] = p5.Vector.random2D();
        this.genes[i].setMag(maxforce);
      }
    }   
  }
  
  crossover(partner) {
    let child = [];
    let midpoint = floor(random(this.genes.length));
    for (let i = 0; i < this.genes.length; i++) {
      if (i > midpoint) child[i] = this.genes[i];
      else child[i] = partner.genes[i];
    }
    let newgenes = new DNA(child);
    return newgenes;    
  }
  
  mutate(m) {
    for (let i = 0; i < this.genes.length; i++) {
      if (random(1) < m) {
        this.genes[i] = p5.Vector.random2D();
        this.genes[i].setMag(maxforce);
      }
    }    
  }
}

class Rocket {
  constructor(loc, dna) {
    this.acc = createVector();
    this.vel = createVector();
    this.pos = loc.copy();
    this.r = 4;
    this.fitness = 0;
    this.dna = dna;
    this.geneCounter = 0;
    
    this.hitTarget = false;
  }
  
  calcFitness() {
    let d = dist(this.pos.x, this.pos.y, target.x, target.y);
    this.fitness = pow(1 / d, 2);
  }
  
  checkTarget() {
    let d = dist(this.pos.x, this.pos.y, target.x, target.y);
    if (d < 12) {
      this.hitTarget = true;
    }
  }
  
  applyForce(f) {
    this.acc.add(f);
  }
  
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  show() {
    let theta = this.vel.heading() + PI / 2;
    let r = this.r;
    stroke(0);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(theta);

    // Rocket body
    fill(255);
    beginShape(TRIANGLES);
    vertex(0, -r * 2);
    vertex(-r, r * 2);
    vertex(r, r * 2);
    endShape(CLOSE);

    pop();    
  }
  
  run() {
    this.checkTarget();
    if (!this.hitTarget) {
      this.applyForce(this.dna.genes[this.geneCounter]);
      this.geneCounter = (this.geneCounter + 1) % this.dna.genes.length;
      this.update();
    }
    this.show();
  }
}

class Population {
  constructor(m, num) {
    this.mutationRate = m;
    this.rockets = [];
    this.matingPool = [];
    this.generations = 0;
    for (let i=0; i < num; i++) {
      let location = createVector(width /2, height + 20);
      this.rockets[i] = new Rocket(location, new DNA());
    }
  }
  
  live() {
    for (let i = 0; i < this.rockets.length; i++) {
      this.rockets[i].run();
    }
  }
  
  fitness() {
    for (let i = 0; i < this.rockets.length; i++) {
      this.rockets[i].calcFitness();
    }    
  }
  
  selection() {
    this.matingPool = [];
    var maxFitness = this.getMaxFitness();
    
    for (let i = 0; i < this.rockets.length; i++) {
      let fitnessNormal = map(this.rockets[i].fitness, 0, maxFitness, 0, 1);
      let n = floor(fitnessNormal * 100); // Arbitrary multiplier

      for (let j = 0; j < n; j++) {
        this.matingPool.push(this.rockets[i]);
      }
    }  
  }
  
  reproduction() {
    for (let i = 0; i < this.rockets.length; i++) {
      let m = floor(random(this.matingPool.length));
      let d = floor(random(this.matingPool.length));
      let mom = this.matingPool[m];
      let dad = this.matingPool[d];
      let momgenes = mom.dna;
      let dadgenes = dad.dna;
      let child = momgenes.crossover(dadgenes);
      child.mutate(this.mutationRate);
      let location = createVector(width / 2, height + 20);
      this.rockets[i] = new Rocket(location, child);
    }
    this.generations++;    
  }
  
  getMaxFitness() {
    var record = 0;
    for (let i = 0; i < this.rockets.length; i++) {
      if (this.rockets[i].fitness > record) {
        record = this.rockets[i].fitness;
      }
    }
    return record;
  }  
}