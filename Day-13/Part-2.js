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
    x: BigInt(parseInt(px, 10)) + BigInt(10000000000000),
    y: BigInt(parseInt(py, 10)) + BigInt(10000000000000),
  };

  machines.push(machine);
}

function solve(m) {
  let ax = BigInt(m.a.x);
  let ay = BigInt(m.a.y);
  let bx = BigInt(m.b.x);
  let by = BigInt(m.b.y);
  let px = m.p.x;
  let py = m.p.y;

  const pz = py * bx - px * by;
  const az = ay * bx - ax * by;

  if (pz % az !== BigInt(0)) {
    return Infinity;
  }
  let a = pz / az;

  if ((px - ax * a) % bx !== BigInt(0)) {
    return Infinity;
  }
  let b = (px - ax * a) / bx;

  return a * BigInt(3) + b;

}

let runningTotal = BigInt(0);
for (let m of machines) {
  const s = solve(m);
  if (s < Infinity) {
    runningTotal += s;
  }
}
console.log('-------------------------------');
console.log(runningTotal);
