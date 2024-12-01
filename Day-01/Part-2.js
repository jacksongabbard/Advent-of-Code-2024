const fs = require('fs');

const input = fs.readFileSync('./input.txt').toString('utf-8');

const lines = input.split('\n').filter(Boolean);


let leftVals = [];
let rightCounts= {};
for (let line of lines) {
  const [l, r] = line.split(/\s+/);
  leftVals.push(l);
  if (rightCounts[r] === undefined) {
    rightCounts[r] = 0;
  }
  rightCounts[r]++;
}


let similarity = 0;
for (let i=0; i<leftVals.length; i++) {
  const l = leftVals[i];
  const sim = l * (rightCounts[l] || 0);
  similarity += sim;
}

console.log({ similarity });


