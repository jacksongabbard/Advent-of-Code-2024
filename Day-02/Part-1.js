const fs = require('fs');

const input = fs.readFileSync('./input.txt').toString('utf-8');

const lines = input.split('\n').filter(Boolean);


let safe = 0;
outer: for (const line of lines) {
  const levels = line.split(' ').map(str => parseInt(str, 10));
  const dir = levels[1] - levels[0];
  if (dir === 0) {
    continue outer;
  }

  let last = levels[0];
  for (let i=1; i<levels.length; i++) {
    const _last = last;
    last = levels[i];

    if (dir < 0 && levels[i] > _last) {
      continue outer;
    }
    if (dir > 0 && levels[i] < _last) {
      continue outer;
    }

    const diff = Math.abs(levels[i] - _last);
    if (diff < 1 || diff > 3) {
      continue outer;
    }
  }
  safe++;
}

console.log(safe);
