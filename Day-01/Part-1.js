const fs = require('fs');

const input = fs.readFileSync('./input.txt').toString('utf-8');

const lines = input.split('\n').filter(Boolean);

console.log(lines);

let diff = 0;
let leftVals = [];
let rightVals = [];
for (let line of lines) {
  const [l, r] = line.split(/\s+/);
  console.log({ l, r });
  leftVals.push(l);
  rightVals.push(r);
}

leftVals.sort();
rightVals.sort();

for (let i=0; i<leftVals.length; i++) {
  const l = leftVals[i];
  const r = rightVals[i];

  diff += Math.abs(l - r);
}


console.log(diff);
