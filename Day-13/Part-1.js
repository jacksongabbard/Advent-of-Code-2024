const fs = require('fs');

const input = fs.readFileSync('./input.txt').toString('utf-8');

const lines = input.split('\n');

const buttonRegex = /^Button [AB]: X\+(\d+)\, Y\+(\d+)$/;
const prizeRegex = /^Prize: X=(\d+)\, Y=(\d+)$/;

const machines = [];
for (let i=0; i<lines.length; i+=4) {
  const machine = {};
  const [_a, ax, ay] =
    lines[i + 0].match(buttonRegex);
  machine.a = { x: parseInt(ax, 10), y: parseInt(ay, 10) };

  const [_b, bx, by] =
    lines[i + 1].match(buttonRegex);
  machine.b = { x: parseInt(bx, 10), y: parseInt(by, 10) };

  const [_p, px, py] =
    lines[i + 2].match(prizeRegex);
  machine.p = { x: parseInt(px, 10), y: parseInt(py, 10) };

  machines.push(machine);
}

function solve(m) {
let cheapestWinner = Infinity;
  for (let aSteps = 0; aSteps < 100; aSteps++) {
    for (let bSteps = 0; bSteps < 100; bSteps++) {
      const x = aSteps * m.a.x + bSteps * m.b.x;
      const y = aSteps * m.a.y + bSteps * m.b.y;
      if (x === m.p.x && y === m.p.y) {
        cheapestWinner = Math.min(cheapestWinner, aSteps * 3 + bSteps);
      }
    }
  }
  return cheapestWinner;
}

let runningTotal = 0;
for (let m of machines) {
  const s = solve(m);
  if (s < Infinity) {
    runningTotal += s;
  }
}
console.log(runningTotal);
