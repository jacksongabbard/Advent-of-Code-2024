const fs = require('fs');

const input = fs.readFileSync('./input.txt').toString('utf-8');

const lines = input.split('\n').filter(Boolean);

const grid = [];

let y=0;
for (let line of lines) {
  grid[y] = line.split('').filter(Boolean);
  y++;
}

const height = lines.length;
const width = grid[0].length;


function g(y, x) {
  if (grid[y] && grid[y][y]) {
    return grid[y][x];
  }

  return undefined;
}

function countFromPoint(x, y) {
  if (g(y,x) !== 'A') {
    return 0;
  }

  const worksAlongMainAxis =
    (g(y - 1, x - 1) === 'M'  && g(y + 1, x + 1) === 'S') ||
    (g(y - 1, x - 1) === 'S'  && g(y + 1, x + 1) === 'M');

  if (worksAlongMainAxis) {

    const worksAlongCrossAxis =
      (g(y + 1, x - 1) === 'M'  && g(y - 1, x + 1) === 'S') ||
      (g(y + 1, x - 1) === 'S'  && g(y - 1, x + 1) === 'M')

    if (worksAlongCrossAxis) {
      return 1;
    }
  }

  return 0;
}


let count = 0;
for (let y=0; y<height; y++) {
  for (let x=0; x<width; x++) {
    count += countFromPoint(x, y);
  }
}

console.log({ count });

