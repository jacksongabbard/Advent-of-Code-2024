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
  machine.p = {
    x: parseInt(px, 10) * 10000000000000,
    y: parseInt(py, 10) * 10000000000000,
  };

  machines.push(machine);
}

function solve(m, xDist, yDist, memo={}) {
  if (memo[xDist + ',' + yDist]) {
    return memo[xDist + ',' + yDist];
  }

  if (xDist < 0 || yDist < 0) {
    return Infinity;
  } else if (xDist === 0 && yDist === 0) {
    return 0;
  }

  const leftCost = 3 + solve(m, xDist - m.a.x, yDist - m.a.y, memo);
  const rightCost = 1 + solve(m, xDist - m.b.x, yDist - m.b.y, memo);

  memo[xDist + ',' + yDist] = Math.min(leftCost, rightCost);
  return  memo[xDist + ',' + yDist];
}

let runningTotal = 0;
for (let m of machines) {
  const s = solve(m, m.p.x, m.p.y);
  console.log(m, s);
  if (s < Infinity) {
    runningTotal += s;
  }
}
console.log(runningTotal);
