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
  let count = 0;

  // up
  if (
    g(y-0, x) === 'X' &&
    g(y-1, x) === 'M' &&
    g(y-2, x) === 'A' &&
    g(y-3, x) === 'S'
  ) {
    count++;
  }

  // down
  if (
    g(y+0, x) === 'X' &&
    g(y+1, x) === 'M' &&
    g(y+2, x) === 'A' &&
    g(y+3,x) === 'S'
  ) {
    count++;
  }

  // left
  if (
    g(y, x-0) === 'X' &&
    g(y, x-1) === 'M' &&
    g(y, x-2) === 'A' &&
    g(y,x-3) === 'S'
  ) {
    count++;
  }

  // right
  if (
    g(y, x+0) === 'X' &&
    g(y, x+1) === 'M' &&
    g(y, x+2) === 'A' &&
    g(y, x+3) === 'S'
  ) {
    count++;
  }

  // up left
  if (
    g(y-0, x-0) === 'X' &&
    g(y-1, x-1) === 'M' &&
    g(y-2, x-2) === 'A' &&
    g(y-3, x-3) === 'S'
  ) {
    count++;
  }

  // up right
  if (
    g(y-0, x+0) === 'X' &&
    g(y-1, x+1) === 'M' &&
    g(y-2, x+2) === 'A' &&
    g(y-3, x+3) === 'S'
  ) {
    count++;
  }

  // down left
  if (
    g(y+0, x-0) === 'X' &&
    g(y+1, x-1) === 'M' &&
    g(y+2, x-2) === 'A' &&
    g(y+3, x-3) === 'S'
  ) {
    count++;
  }

  // down right
  if (
    g(y+0, x+0) === 'X' &&
    g(y+1, x+1) === 'M' &&
    g(y+2, x+2) === 'A' &&
    g(y+3, x+3) === 'S'
  ) {
    count++;
  }

  return count;
}


let count = 0;
for (let y=0; y<height; y++) {
  for (let x=0; x<width; x++) {
    count += countFromPoint(x, y);
  }
}

console.log({ count });

