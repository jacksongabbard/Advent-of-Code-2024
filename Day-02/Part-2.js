const fs = require('fs');

const input = fs.readFileSync('./input.txt').toString('utf-8');

const lines = input.split('\n').filter(Boolean);


function isSafe(levels) {
  const dir = levels[1] - levels[0];
  if (dir === 0) {
    return false;
  }

  let last = levels[0];
  for (let i=1; i<levels.length; i++) {
    const _last = last;
    last = levels[i];

    if (dir < 0 && levels[i] > _last) {
      return false;
    }
    if (dir > 0 && levels[i] < _last) {
      return false;
    }

    const diff = Math.abs(levels[i] - _last);
    if (diff < 1 || diff > 3) {
      return false;
    }
  }
  return true;
}

function isSafeWithOneValueRemoved(levels) {
  for (let i=0; i<levels.length; i++) {
    const newLevels = [...levels];
    newLevels.splice(i, 1);
    if (isSafe(newLevels)) {
      return true;
    }
  }
  return false;
}

let safe = 0;
for (const line of lines) {
  let hasDampened = false;
  const levels = line.split(' ').map(str => parseInt(str, 10));
  if (isSafe(levels) || isSafeWithOneValueRemoved(levels)) {
    safe++;
  }
}

console.log(safe);
